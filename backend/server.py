# main.py
# uvicorn server:app --host 0.0.0.0 --port 8000
import os
from openai import OpenAI
from dotenv import load_dotenv

from browser_use import Agent
from browser_use.llm.openai.chat import ChatOpenAI

from pydantic import BaseModel
from typing import Optional, Dict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Schemas ===
class PromptRequest(BaseModel):
    prompt: str

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    reply: str
    tools_output: Optional[Dict[str, str]] = None

# Home
@app.get("/")
def root():
    return {"message": "🚀 Backend is Running!"}

# Chat
@app.post("/api/chat", response_model=ChatResponse)
async def chat_route(data: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": data.prompt}],
            temperature=0.7,
        )
        reply = response.choices[0].message.content
        return {"reply": reply, "tools_output": None}
    except Exception as e:
        return {"reply": f"❌ LLM error: {str(e)}", "tools_output": None}
    
# Automation
@app.post("/api/agent")
async def agent_endpoint(req: PromptRequest):
    llm = ChatOpenAI(model="gpt-4.1-mini")
    agent = Agent(task=req.prompt, llm=llm)
    await agent.run()
    return {"status": "done", "task": req.prompt}
