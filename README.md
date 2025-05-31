# AI Browser Agent

## Overview

AI Browser Agent is a privacy-first, intelligent automation assistant that runs locally on a user’s machine to perform various browser-based tasks. It automates actions like buying tickets, ordering groceries, or filling out forms by interpreting open tabs, understanding user intent via LLMs, and executing commands — all without sending data to external servers.

Inspired by tools like OpenAI's Operator and Claude 3.5's Computer Use mode.

## Why It Matters

- No credentials or personal data are sent to the cloud.
- Runs entirely on local resources.
- Ideal for users concerned with privacy, automation, and efficiency.


## Tech Stack

| Component | Technology |
|----------|------------|
| Frontend | Electron (Node.js), React |
| Backend | Python (FastAPI or Flask) |
| Browser Automation | Selenium (ChromeDriver) / Puppeteer |
| LLM Integration | OpenAI GPT-3.5 / GPT-4 |
| Planning | Microsoft Semantic Kernel |
| CI/CD | GitHub Actions |
| Cloud Hosting (Optional) | Azure App Service, Azure Static Web Apps |


## Project Flow Diagram

The following diagram visualizes the architecture and flow of the AI Browser Agent system:

![Project Flow Diagram](https://raw.githubusercontent.com/AyushPoojariUCD/ai-browser-agent/main/Project%20Workflow.png)



The above diagram illustrates the interaction between:
- User Interface (Electron + React)
- Backend API (Flask/FastAPI)
- Browser Automation (Selenium)
- LLM Planning (OpenAI GPT-4)
- Microsoft Semantic Kernel Validation
- Feedback Loop & Execution


## Project Base Skeleton
```
ai-browser-agent/
│
├── .github/                # GitHub workflows for CI/CD
│   └── workflows/
│       └── azure-deploy.yml
│
├── frontend/               # Electron + React desktop app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── assets/
│   ├── main.js             # Electron main process
│   ├── package.json
│   └── webpack.config.js
│
├── backend/                # FastAPI backend service
│   ├── main.py             # Entry point for FastAPI
│   ├── llm_engine.py       # Calls OpenAI + Semantic Kernel
│   ├── selenium_bot.py     # Browser Automation handler
│   ├── models/             # Pydantic models
│   └── requirements.txt
│
├── scripts/
│   ├── build_and_package.sh     # Electron packaging script
│   └── az_deploy.sh             # Azure CLI deployment
│
├── .env                    # Environment variables
├── Dockerfile              # Docker config for backend
├── docker-compose.yml      # Service orchestration
├── README.md               # Full project documentation
└── LICENSE
```
---
## How to Run the Desktop Application
### 1. Clone the Repository
```bash
git clone https://github.com/AyushPoojariUCD/ai-browser-agent.git
cd ai-browser-agent
```
---

## Links

- Report Link
- Video Demonstration Link

---
## Team Members


- **Tarun Kumar** 

- **Ayush Poojari** 

- **Preet Raut** 

- **Sudhanshu Ghuge** 

- **Deepak Shelke** 

- **Soham Deo** 

---
