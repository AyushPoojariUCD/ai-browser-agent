# AI Browser Agent

A privacy-preserving AI assistant that automates tasks like ticket booking, form filling, and web scraping directly in your local browser using LLMs, Selenium and Electron.

## Overview

The AI Browser Agent is a locally run desktop application designed to help users automate complex web-based tasks through natural language commands. Unlike cloud-based assistants, it executes all actions directly on the user's device, ensuring that sensitive information such as passwords, personal data, and browsing activity never leave the local environment.

By integrating large language models (LLMs) with browser automation frameworks like Selenium, the agent can understand user intents, analyze the content of multiple open browser tabs, and perform multi-step tasks autonomously. The use of Microsoft’s Semantic Kernel adds an extra layer of controlled, secure execution for each automation steps.


## Features

- Chat interface for conversational task instructions
- End-to-end local execution; no data sent to cloud servers
- Automated task execution across browser tabs
- Browser content analysis using Puppeteer or Selenium
- Workflow planning using large language models (LLMs)
- Semantic Kernel integration for structured and secure task execution
- Built with React, Electron, Express, Firebase, and Selenium

---

## Example Use Case

## ✈️ Flight Booking Use Case

This visual demonstrates how an AI agent processes a user's request to book a flight from **London to New York on August 30, 2025**.

The task flows through a **Plan → Act → Observe** loop:

1. **Plan:** The agent understands the user's intent and extracts relevant parameters such as:
   - Departure location: London  
   - Destination: New York  
   - Travel date: August 30, 2025

2. **Act:** The agent inputs these parameters into the booking system and initiates a search for available flights.

3. **Observe:** The system monitors the results and selects or displays a suitable flight.

A mock flight result is shown to illustrate the system’s response and how the loop completes successfully.

This use case highlights the AI agent’s ability to make autonomous decisions in real-world travel scenarios, showcasing end-to-end automation and intelligent reasoning.

![Flight Booking Use Case](https://github.com/AyushPoojariUCD/ai-browser-agent/blob/main/docs/use-case-flight-booking.jpg)


## 🛒 Grocery Shopping Use Case

This image illustrates an AI assistant executing a command to add **tomatoes** to a Tesco grocery cart.

Following the **Observe → Plan → Act** cycle:

1. **Observe:** The assistant analyzes the interface and detects relevant product listings.
2. **Plan:** It understands the intent to add tomatoes and identifies the correct action.
3. **Act:** The agent clicks the “Add to cart” button associated with the correct item.

The visual demonstrates how the AI assistant interacts autonomously with mobile web interfaces, simulating human-like task execution by:

- Observing available items  
- Planning next steps  
- Acting based on context

This use case showcases the AI’s capability in **e-commerce automation**, making routine tasks like grocery shopping seamless and intelligent.

![Grocery Shopping Use Case](https://github.com/AyushPoojariUCD/ai-browser-agent/blob/main/docs/use-case-grocery-ordering.jpg)


---

## Project Workflow

![Project Workflow](https://github.com/AyushPoojariUCD/ai-browser-agent/blob/main/docs/project-workflow.png)


---

## 👩‍💻 Tech Stack

| Component            | Technology                                      |
|----------------------|-------------------------------------------------|
| UI                   | React, Electron, Tailwind CSS                   |
| Backend              | Python, Express (Node.js), Firebase Admin SDK   |
| Browser Automation   | Selenium                                        |
| Task Execution       | Microsoft Semantic Kernel                       |
| Planning             | OpenAI GPT / Claude Anthorpic                   |
| Deployment           | Docker, Kubernetes, Azure Cloud (App Service)   |

---

## 📂 Project Structure

```
ai-browser-agent/
│
├── backend/                                    # Backend
│ ├── routes/
│ ├── config/
│ └── index.js
│
├── frontend/                                   # Fronted: React + Electron
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── contexts/
│ │ └── App.jsx
│
├── electron/                                   # Electron entry point
│ └── main.mjs
│
├── k8s/                                        # Kubernetes manifests
│ ├── frontend-deployment.yaml
│ ├── backend-deployment.yaml
│
├── Dockerfile # Base Dockerfile for backend
├── Dockerfile.frontend                         # Dockerfile for frontend
├── .env                                        # Environment variables
└── README.md

```

## Installation

 **Clone the Repository**

```bash
git clone https://github.com/yourname/ai-browser-agent.git
cd ai-browser-agent
```

**Navigate to the Frontend Directory**

```bash
cd frontend
```
**Install Dependencies**
```
npm install
```

**Install Dependencies**
```
npm install electron
```

- NOTE: `Configure firebase/config`

**Steps to run Frontend : `AI Browser Agent`**
```
npm run electron-dev

npm run electron
```

---

## Additional Resources
- [LLM Integration Decision](https://github.com/AyushPoojariUCD/ai-browser-agent/blob/main/docs/llm-integration-decision.pdf)
- [Project Plan](https://github.com/Soham-2211/AI-Browser-Agent/blob/main/Project%20Plan.pdf)
- [Documentation](https://your-video-link.com)  
- [Video Demonstration](https://your-video-link.com)  


## Team Members : `Coding Thumbs 👍`

- **Tarun Kumar**  
- **Ayush Poojari**
- **Deepak Shelke**
- **Sudhanshu Ghuge**    
- **Preet Raut** 
- **Soham Deo**
  
