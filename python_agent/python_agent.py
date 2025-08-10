# python_agent/main.py

# ── Env overrides BEFORE importing browser_use ─────────────────────────────────
import os
import json
import asyncio
from pathlib import Path
from urllib.parse import quote

PROJECT_DIR = Path(__file__).parent.resolve()

# Keep browser_use config inside project (no ~/.config)
LOCAL_CONFIG = (PROJECT_DIR / ".browseruse-config").resolve()
LOCAL_CONFIG.mkdir(parents=True, exist_ok=True)
os.environ["BROWSER_USE_CONFIG_DIR"] = str(LOCAL_CONFIG)
os.environ["XDG_CONFIG_HOME"] = str(PROJECT_DIR)

# Optional: disable extensions if they interfere
os.environ.setdefault("BROWSER_USE_DISABLE_EXTENSIONS", "1")

# ── Load .env for OPENAI_API_KEY ──────────────────────────────────────────────
from dotenv import load_dotenv
load_dotenv(PROJECT_DIR / ".env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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

# ── Helpers ──────────────────────────────────────────────────────────────────
def normalize_url(raw_url: str) -> str:
    u = (raw_url or "").strip()
    if not u:
        raise ValueError("No URL in intent")
    if not u.startswith(("http://", "https://")):
        u_low = u.lower()
        if "." in u_low:
            u = f"https://{u_low}"
        else:
            u = f"https://www.{u_low}.com"
    return u

def build_single_tab_task(url: str, action: str, item: str) -> str:
    base = f"Continue in the current tab on {url}, then {action} {item}".strip()
    rules = (
        " Do NOT open any new tabs or windows. "
        "Reuse this same tab for all steps. "
        "If something tries to open a new tab, force navigation in the current tab instead. "
        "If a new tab still opens, switch back here and continue."
    )
    return base + "." + rules

async def llm_parse_intent(user_prompt: str) -> dict:
    parse_prompt = f"""
You are an assistant that extracts browser actions from a user request.
Input: \"\"\"{user_prompt}\"\"\"
Return ONLY strict JSON with keys: url, action, item. Example:
{{"url":"<domain or full URL>","action":"<search|play|add_to_cart|login|navigate|read>","item":"<term or payload>"}}
"""
    res = openai_client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0,
        messages=[{"role": "user", "content": parse_prompt}],
    )
    return json.loads(res.choices[0].message.content)

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

    # b) Normalize inputs
    try:
        url    = normalize_url(parsed.get("url", ""))
        action = (parsed.get("action") or "").strip().lower()
        item   = (parsed.get("item") or "").strip()
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
