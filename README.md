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

FlowBreak/
├── flowbreak-client/ # React frontend
├── flowbreak-server/ # Node.js backend + PostgreSQL
├── flowbreak-extension/ # Chrome extension (MV3)
├── flowbreak-agent/ # Python FastAPI reasoning agent
└── README.md


---

## 🚀 Setup & Installation

### 1️⃣ PostgreSQL Database

```sql
CREATE DATABASE flowbreak;
```


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
