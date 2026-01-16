# 🚀 FlowBreak — Intelligent Focus Analytics Platform

**Tagline:**  
*Measure, understand, and improve your focus using real-time behavior analytics and explainable AI reasoning.*

---

## 🧠 What is FlowBreak?

FlowBreak is a full-stack focus analytics platform that helps users understand their attention patterns while working online. It tracks tab activity via a Chrome extension, computes focus metrics in a Node.js backend, and powers an explainable AI agent in Python that answers follow-up user queries about productivity.

It’s perfect for:
✔ students  
✔ remote workers  
✔ people who want to self-analyze productivity   
✔ anyone interested in real-world full-stack + AI-like systems

---

## 🔥 Key Features

### 📊 Analytics & Insights

✔ **Focus Score** — Calculates a 0–100 score based on breaks, idle time, and distracting domains  
✔ **Attention Break Detection** — Detects and visualizes context switches and distraction loops  
✔ **Domain Distribution** — Shows top websites that affected focus  

### 🤖 Explainable Reasoning Agent

✔ Rule-based Python agent (FastAPI)  
✔ Answers questions like:
   - “Why was my focus low?”
   - “How can I improve?”
   - “Which sites distracted me?”
✔ Deterministic, transparent logic (no opaque ML models)

### 🛠 Full-Stack Architecture

✔ Chrome Extension (MV3) tracks user activity  
✔ Node.js API server ingests events, computes analytics  
✔ PostgreSQL database for persistent storage  
✔ React dashboard visualizes analytics and supports interactive chat with agent

---

## 📁 Project Structure
FlowBreak/
├── flowbreak-client/ # React frontend
├── flowbreak-server/ # Node.js API + PostgreSQL
├── flowbreak-extension/ # Chrome extension
├── flowbreak-agent/ # Python FastAPI reasoning agent
└── README.md # This file

---

## 🚀 Setup & Installation

### 1️⃣ PostgreSQL Database

```sql
CREATE DATABASE flowbreak;
```

2️⃣ Backend (Node.js)
cd flowbreak-server
npm install

Create .env:

PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_DATABASE=flowbreak
AGENT_URL=http://localhost:8001


Start:
npm run dev

3️⃣ Python Agent (FastAPI)
cd flowbreak-agent
python -m venv venv
venv\Scripts\activate        # Windows
# OR
source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt

Create .env:

AGENT_HOST=127.0.0.1
AGENT_PORT=8001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001


Start:
python main.py
Agent docs: http://localhost:8001/docs

4️⃣ Frontend (React)
cd flowbreak-client
npm install
npm run dev

Open:
http://localhost:3000

5️⃣ Chrome Extension
Open chrome://extensions
Enable Developer Mode
Click Load Unpacked
Select flowbreak-extension/

💬 How to Use
Load the extension
Open sites and switch tabs
Go to Dashboard
Enter your email
Load your analytics
Ask the Focus Agent questions

🧪 Sample Chat Queries
✔ “Why was my focus low?”
✔ “What are my top distracting domains?”
✔ “How can I improve focus?”
✔ “Explain idle time patterns”

🛡 Security
Environment variables are kept outside source control using .env. A safe .env.example exists in each service directory.

🏅 Tech Stack
Layer	                   Technologies
Chrome Extension	       JavaScript (MV3)
Backend API	             Node.js, Express
Database	               PostgreSQL
Frontend	               React, Vite 
AI Reasoning Service	   Python, FastAPI, Pydantic

⭐ Credits
Built by Lakshya Gupta

📄 License
MIT License
