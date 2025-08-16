# AI Browser Agent with Python Backend

This project is an **AI-powered browser automation agent** leveraging the [`browser-use`](https://github.com/browser-use/browser-use) package for managing tasks, workflows, and complete automation.  
It can navigate websites, interact with elements, and perform tasks automatically based on natural language prompts.

---

## 📂 Project Structure
```plaintext
ai-browser-agent/backend
├── .cursor
├── bin/
│   └── (scripts or CLI utilities)
│
├── llm/
│   ├── __init__.py
│   ├── llm_automation.py
│   └── llm_chat.py
│
├── schemas/
│   ├── __init__.py
│   └── chat.py
│
├── utils/
│   ├── __init__.py
│   └── check_api_key.py
|
├── server.py
├── .python-version
├── uv.lock
├── .gitignore
├── pyproject.toml
└── README.md
``` 

--- 

## 🖇️Installation

#### Clone the repository
```bash
git clone https://github.com/AyushPoojariUCD/ai-browser-agent/
cd ai-browser-agent
```

#### Set up a virtual environment
```
uv venv
```


#### Install dependencies
 uv sync 

#### Run Server
```
uvicorn server:app --host 0.0.0.0 --port 8000
```

---

## 🚀 API Endpoints
Once the server is running, you can:

Access the API at: http://localhost:8000

Use /api/chat for chat-based LLM queries.

Use /api/agent for automated browser tasks.

---

## 🛠️ Tech Stack
Backend Framework: Python, FastAPI, Browse Use

LLM Providers: OpenAI, Google Gemini, DeepSeek, Groq, Anthropic, AWS Bedrock, Ollama

Automation Engine: browser-use

Package Manager: uv

---

