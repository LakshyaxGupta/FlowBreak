# 🚀 FlowBreak — Intelligent Focus Analytics Platform

**Tagline:**  
*Measure, understand, and improve your focus using real-time behavior analytics and explainable AI reasoning.*

---

## 🧠 What is FlowBreak?

**FlowBreak** is a full-stack productivity analytics platform that helps users **measure, understand, and improve their focus** while working online.

It tracks browsing behavior using a Chrome extension, computes focus metrics on the backend, visualizes insights in a React dashboard, and provides **explainable AI-style reasoning** through a Python FastAPI agent.

This project is built to demonstrate **real-world system design**, not a copy-paste AI chatbot.

---

## ⚡ Key Features

### 📊 Analytics & Insights
- ✔ **Focus Score (0–100)** — Calculated using attention breaks, idle time, and distracting domains
- ✔ **Attention Break Detection** — Detects rapid tab switching, navigation loops, and idle spikes
- ✔ **Idle Time Analysis** — Identifies periods of inactivity during sessions
- ✔ **Domain Distribution** — Shows which websites contributed most to distraction

---

### 🤖 Explainable Reasoning Agent
A **rule-based Focus Insight Agent** built with **Python FastAPI**.

It answers questions like:
- “Why was my focus low?”
- “How can I improve my focus?”
- “Which sites distracted me the most?”
- “Explain my idle time.”
- “Summarize this session.”

✅ Deterministic  
✅ Transparent logic  
✅ Context-aware follow-up questions 

---

### 🧩 Components Overview

#### ✔ Chrome Extension (MV3)
- Tracks tab switches
- Captures visited domains
- Records timestamps for activity

#### ✔ Node.js Backend
- Ingests events from extension
- Reconstructs sessions
- Computes analytics
- Communicates with Python agent

#### ✔ PostgreSQL Database
- Stores users
- Stores sessions
- Stores event logs

#### ✔ React Dashboard
- Focus score visualization
- Attention break timeline
- Domain charts
- Interactive chat UI for agent

#### ✔ Python FastAPI Agent
- Stores session context
- Applies rule-based reasoning
- Generates explanations & suggestions

---


## 📁 Project Structure

```
FlowBreak/
├── flowbreak-client/      # React frontend
├── flowbreak-server/      # Node.js backend + PostgreSQL
├── flowbreak-extension/   # Chrome extension (MV3)
├── flowbreak-agent/       # Python FastAPI reasoning agent
└── README.md
```

---

## 🚀 Setup & Installation

### 1️⃣ PostgreSQL Database

```sql
CREATE DATABASE flowbreak;
```

### 2️⃣ Backend (Node.js)

```bash
cd flowbreak-server
npm install
```

Create `.env`:

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_DATABASE=flowbreak
AGENT_URL=http://localhost:8001
```

Start backend:

```bash
npm run dev
```

### 3️⃣ Python Focus Insight Agent

```bash
cd flowbreak-agent
python -m venv venv
```

Activate environment:

**Windows:**
```bash
venv\Scripts\activate
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```env
AGENT_HOST=127.0.0.1
AGENT_PORT=8001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

Run agent:

```bash
python main.py
```

API Docs: `http://localhost:8001/docs`

### 4️⃣ Frontend (React)

```bash
cd flowbreak-client
npm install
npm run dev
```

Open: `http://localhost:3000`

### 5️⃣ Chrome Extension

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click Load Unpacked
4. Select `flowbreak-extension/`

---

## 💬 How to Use

1. Load the Chrome extension
2. Browse normally (YouTube, GitHub, StackOverflow, etc.)
3. Open the dashboard
4. Enter your email
5. Load analytics
6. Ask questions to the Focus Insight Agent

---

## 🧪 Sample Queries

- "Why was my focus low?"
- "What are my top distracting domains?"
- "How can I improve focus?"
- "Explain my idle time."
- "Summarize this session."

---

## 🛡 Security

- Secrets stored in `.env` files
- `.env` ignored via `.gitignore`
- `.env.example` provided for reference
- Sensitive credentials never committed

---


## ⭐ Credits
Built with ❤️ by Lakshya Gupta

## 📄 License
MIT License