# main.py
# uvicorn server:app --host 0.0.0.0 --port 8000
from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from browser_use.llm.openai.chat import ChatOpenAI
from browser_use import Agent

load_dotenv()

app = FastAPI()

# Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/api/agent")
async def run_agent(req: PromptRequest):
    print(req)
    llm = ChatOpenAI(model="gpt-4.1-mini")
    agent = Agent(task=req.prompt, llm=llm)
    await agent.run()
    return {"status": "done", "task": req.prompt}