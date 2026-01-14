# server.py
# Run with: uvicorn server:app --host 0.0.0.0 --port 8000
import os
from dotenv import load_dotenv

from browser_use import Agent
from llm.llm_chat import chat_completion
from llm.llm_automation import get_llm_instance

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas.chat import PromptRequest, ChatRequest, ChatResponse

from utils.check_api_key import check_required_api_key


load_dotenv()

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Routes ===
@app.get("/")
def root():
    return {"message": "🚀 Backend is Running!"}

# Chat
@app.post("/api/chat", response_model=ChatResponse)
async def chat_route(data: ChatRequest):
    try:
        print(data.provider,data.prompt)
        reply = chat_completion(data.provider, data.prompt, data.temperature)
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"❌ LLM error: {str(e)}", "tools_output": None}
    
# Automation
@app.post("/api/agent")
async def agent_endpoint(req: PromptRequest):
    print(req)
    if not check_required_api_key(req.provider):
        raise HTTPException(status_code=400, detail=f"Missing API key(s) for {req.provider}")
    llm = get_llm_instance(req.provider, req.temperature)
    print(llm)
    agent = Agent(task=req.prompt, llm=llm)
    await agent.run()
    return {"status": "done", "task": req.prompt}
