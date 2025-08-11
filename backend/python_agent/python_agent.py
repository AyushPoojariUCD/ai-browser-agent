# python_agent/main.py

# ── Env overrides BEFORE importing browser_use ─────────────────────────────────
import os
import re
import json
import asyncio
from pathlib import Path
from urllib.parse import quote, urlparse

PROJECT_DIR = Path(__file__).parent.resolve()

# Keep browser_use config inside project (no ~/.config)
LOCAL_CONFIG = (PROJECT_DIR / ".browseruse-config").resolve()
LOCAL_CONFIG.mkdir(parents=True, exist_ok=True)
os.environ["BROWSER_USE_CONFIG_DIR"] = str(LOCAL_CONFIG)
os.environ["XDG_CONFIG_HOME"] = str(PROJECT_DIR)

# Optional: disable extensions if they interfere
os.environ.setdefault("BROWSER_USE_DISABLE_EXTENSIONS", "1")

# ── Load .env ────────────────────────────────────────────────────────────────
from dotenv import load_dotenv
# Load from backend/.env (parent of python_agent)
load_dotenv(PROJECT_DIR.parent / ".env")

# Get key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY is missing. Put it in backend/.env like:\nOPENAI_API_KEY=your_key_here"
    )

# ── Core imports ─────────────────────────────────────────────────────────────
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from openai import OpenAI
from browser_use import Agent, BrowserSession
from browser_use.llm.openai.chat import ChatOpenAI

# ── App + CORS ───────────────────────────────────────────────────────────────
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Single-flight lock so runs don't overlap
agent_lock = asyncio.Lock()

# OpenAI client for intent parsing
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# ── Models ───────────────────────────────────────────────────────────────────
class PromptRequest(BaseModel):
    prompt: str

class AgentResponse(BaseModel):
    status: str
    detail: str

# ── URL helpers ──────────────────────────────────────────────────────────────
BAD_URL_TOKENS = {"undefined", "null", "none", "about:blank", "chrome://newtab"}
PREFERRED_TLDS = [".com", ".ie", ".co.uk"]  # tweak to your audience

def _expand_brand_to_url(token: str) -> str:
    """
    Turn bare brands like 'amazon' or 'tesco' into a plausible URL.
    e.g., 'amazon' -> https://www.amazon.com (or .ie / .co.uk if you prefer)
    """
    t = (token or "").strip().lower()
    if not t or any(x in t for x in BAD_URL_TOKENS) or " " in t:
        raise ValueError("Not a brand-like token")
    t = t.strip("/").strip(".")
    if t.startswith("www."):
        t = t[4:]
    for tld in PREFERRED_TLDS:
        candidate = f"https://www.{t}{tld}"
        parsed = urlparse(candidate)
        if parsed.scheme and parsed.netloc:
            return candidate
    return f"https://{t}.com"

def looks_like_domain_or_url(s: str) -> bool:
    s = (s or "").strip().lower()
    if not s or any(tok in s for tok in BAD_URL_TOKENS):
        return False
    if s.startswith(("http://", "https://")):
        return True
    # allow bare brands (no dot) as domains
    if " " not in s and "." not in s:
        return True
    # allow obvious domains with dots
    return "." in s and (" " not in s)

def normalize_url(raw_url: str) -> str:
    u = (raw_url or "").strip()
    if not u or u.lower() in BAD_URL_TOKENS:
        raise ValueError("Invalid or missing URL in intent")

    if u.startswith(("http://", "https://")):
        parsed = urlparse(u)
        if not parsed.netloc:
            raise ValueError("URL missing host")
        return u

    # If it's a plain brand like 'amazon', expand to a full URL
    if " " not in u and "." not in u:
        return _expand_brand_to_url(u)

    # If it looks like a domain without scheme, add https://
    if "." in u and " " not in u:
        u = f"https://{u}"
        parsed = urlparse(u)
        if not parsed.netloc:
            raise ValueError("URL missing host")
        return u

    raise ValueError("Malformed URL or domain")

# ── Task builder ─────────────────────────────────────────────────────────────
def build_single_tab_task(url: str, action: str, item: str) -> str:
    return (
        f"Start on EXACT URL: {url}. Then {action} {item}. "
        "Do NOT open new tabs or windows. Reuse this same tab for all steps. "
        "If a site tries to open a new tab, force navigation in the current tab; "
        "if one still opens, switch back here and continue. "
        "Do not search for the URL; navigate directly to it."
    )

# ── Intent parsing (LLM) ─────────────────────────────────────────────────────
# detect explicit site/domain/brand tokens users often type
URL_OR_BRAND_REGEX = r"(https?://[^\s]+|www\.[^\s]+|[A-Za-z0-9-]+(?:\.[A-Za-z]{2,})+|[A-Za-z0-9-]{3,})"

async def llm_parse_intent(user_prompt: str) -> dict:
    """
    Extracts intent as strict JSON and guarantees non-empty fields.
    - If the user included a site (URL, domain, or brand word), prefer action 'navigate'
      and keep that site token EXACTLY (we'll normalize it later).
    - If no site is given, default to Google search.
    """
    # Try to detect a site/brand mention to bias the model
    m = re.search(URL_OR_BRAND_REGEX, user_prompt)
    seed = ""
    if m:
        seed = f'User mentioned a site token: "{m.group(0)}". Treat it as the target website/domain if sensible. '

    parse_prompt = f"""
You output strict JSON only. Use the user's site EXACTLY if provided (URL, domain, or brand like "amazon").
If a site is present, set action to "navigate" unless the user explicitly asked to "search".
If no site is given, set url to "google.com" and action to "search" with the entire user prompt as item.
Never output undefined, null, empty strings, or code fences.

Return ONLY this JSON:
{{"url":"<domain or full URL or brand>","action":"<search|play|add_to_cart|login|navigate|read>","item":"<term or payload>"}}

User: \"\"\"{seed}{user_prompt}\"\"\"
""".strip()

    res = openai_client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0,
        messages=[{"role": "user", "content": parse_prompt}],
    )

    content = (res.choices[0].message.content or "").strip()
    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content, flags=re.S)

    try:
        data = json.loads(content)
    except Exception:
        data = {"url": "google.com", "action": "search", "item": user_prompt}

    # Guardrails
    for k in ("url", "action", "item"):
        v = (data.get(k) or "").strip().lower()
        if not v or v in BAD_URL_TOKENS:
            if k == "url":
                data["url"] = "google.com"
            elif k == "action":
                data["action"] = "search"
            else:
                data["item"] = user_prompt.strip()

    # If a site token is detected in the original prompt, prefer navigate
    if m:
        if data.get("action", "").strip().lower() not in {"search"}:
            data["action"] = "navigate"

    return data

# --- Deterministic site extraction (no LLM) -----------------------------------
SITE_HINT_CMD_REGEX = re.compile(
    r'(?i)\b(?:open|go to|navigate to|visit)\s+([a-z0-9.-]+(?:\.[a-z]{2,})?|[a-z0-9-]{3,})'
)
SITE_HINT_URL_REGEX = re.compile(
    r'(?i)(https?://[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,})'
)

def extract_site_hint(user_prompt: str) -> str | None:
    """
    Try hard to pull the target site/domain/brand from the plain text prompt.
    1) Prefer the token after 'open|go to|navigate to|visit ...'
    2) Else, any explicit URL/domain in the text
    Returns None if nothing sensible found.
    """
    if not user_prompt or not isinstance(user_prompt, str):
        return None

    m = SITE_HINT_CMD_REGEX.search(user_prompt)
    if m:
        token = (m.group(1) or "").strip()
        if token and token.lower() not in BAD_URL_TOKENS and " " not in token:
            return token

    m = SITE_HINT_URL_REGEX.search(user_prompt)
    if m:
        token = (m.group(1) or "").strip()
        if token and token.lower() not in BAD_URL_TOKENS and " " not in token:
            return token

    return None

# --- CDP helpers: attach Chrome & open or reuse a tab BEFORE agent ------------
CDP_BASE = "http://127.0.0.1:9222"

def cdp_available() -> bool:
    try:
        r = requests.get(f"{CDP_BASE}/json/version", timeout=2)
        return r.status_code == 200
    except Exception:
        return False

def cdp_reuse_or_open_url(url: str) -> str:
    """
    Try to reuse the first existing tab in Chrome.
    If no tabs exist, open a new one.
    Returns the target tab ID for automation.
    """
    try:
        # Step 1: Check existing tabs
        tabs = requests.get(f"{CDP_BASE}/json/list", timeout=5).json()
        if tabs:
            first_tab_id = tabs[0].get("id")
            if first_tab_id:
                nav_resp = requests.post(
                    f"{CDP_BASE}/json/{first_tab_id}/navigate?url={quote(url, safe='')}",
                    timeout=5
                )
                if nav_resp.status_code == 200:
                    return first_tab_id  # ✅ Reused existing tab

        # Step 2: No tabs or navigation failed — open a new one
        r = requests.put(f"{CDP_BASE}/json/new?{quote(url, safe='')}", timeout=5)
        if r.status_code == 200:
            return r.json().get("id")
        # Step 3: Fallback for old Chrome versions
        r = requests.get(f"{CDP_BASE}/json/new?{quote(url, safe='')}", timeout=5)
        if r.status_code == 200:
            return r.json().get("id")
        raise RuntimeError(f"CDP open failed: {r.status_code} {r.text}")

    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"CDP connection error: {e}")

# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "🚀 Python agent up and ready!"}

@app.post("/api/agent", response_model=AgentResponse)
async def agent_endpoint(req: PromptRequest):
    # a) Parse intent
    try:
        parsed = await llm_parse_intent(req.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ParseIntentError: {e}")

    # >>> New: deterministically extract a site hint from the raw prompt
    site_hint = extract_site_hint(req.prompt)

    # b) Normalize inputs with safe fallback
    try:
        # If we detected a site in plain text, FORCE it (override LLM's "google.com" etc.)
        raw_url = (site_hint or parsed.get("url") or "").strip()

        action  = (parsed.get("action") or "").strip().lower()
        item    = (parsed.get("item") or "").strip()

        # If we had a site hint and user didn't explicitly ask to "search", prefer navigate
        if site_hint and action != "search":
            action = "navigate"

        # Validate URL. If not usable, default to Google search.
        try:
            url = normalize_url(raw_url)
        except Exception:
            url = "https://www.google.com"
            if action != "search":
                action = "search"
            if not item:
                item = req.prompt.strip()

        if not action:
            raise ValueError("No action in intent")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Intent normalization failed: {e}")

    # c) Attach to your existing Chrome and reuse/open tab
    if not cdp_available():
        raise HTTPException(
            status_code=503,
            detail=(
                "Chrome DevTools is not available. Start Chrome with "
                "--remote-debugging-port=9222 and keep it running."
            ),
        )

    try:
        tab_id = cdp_reuse_or_open_url(url)  # get the tab ID we navigated
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CDPOpenError: {e}")

    # d) Build single-tab instruction for the agent
    task_str = build_single_tab_task(url, action, item)

    # e) Attach browser_use to the SAME tab in existing Chrome
    browser_session = BrowserSession(
        connect_url=CDP_BASE,
        headless=False,
        launch=False,
        target_id=tab_id  # ✅ Attach directly to this tab
    )

    llm   = ChatOpenAI(model="gpt-4.1-mini", api_key=OPENAI_API_KEY)
    agent = Agent(task=task_str, llm=llm, browser_session=browser_session)

    # f) Single-flight + timeout + cleanup
    if agent_lock.locked():
        raise HTTPException(status_code=429, detail="Agent is busy. Try again shortly.")

    async with agent_lock:
        try:
            await asyncio.wait_for(agent.run(), timeout=180)  # 3 minutes
            try:
                await agent.aclose()
            except Exception:
                pass
            return AgentResponse(status="success", detail="✅ Task completed")
        except asyncio.TimeoutError:
            try:
                await agent.aclose()
            except Exception:
                pass
            raise HTTPException(status_code=504, detail="Agent timed out. Please try again.")
        except Exception as e:
            try:
                await agent.aclose()
            except Exception:
                pass
            raise HTTPException(status_code=500, detail=f"AgentError: {e}")
