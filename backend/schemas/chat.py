# schemas/chat.py
from pydantic import BaseModel
from typing import Optional

class PromptRequest(BaseModel):
    prompt: str
    provider: Optional[str] = "openai"
    temperature: Optional[float] = 0.7

class ChatRequest(BaseModel):
    prompt: str
    provider: Optional[str] = "openai"
    temperature: Optional[float] = 0.7

class ChatResponse(BaseModel):
    reply: str
