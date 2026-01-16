# Focus Insight Agent Setup

## Quick Start

1. **Install Python dependencies:**
   ```bash
   cd flowbreak-agent
   pip install -r requirements.txt
   ```

2. **Start the Python agent:**
   ```bash
   python main.py
   ```
   The agent will run on `http://localhost:8001`

3. **Install Node.js dependencies (if not already done):**
   ```bash
   cd ../flowbreak-server
   npm install
   ```

4. **Set environment variable (optional):**
   ```bash
   # In flowbreak-server/.env or environment
   AGENT_URL=http://localhost:8001
   ```

5. **Start the Node.js server:**
   ```bash
   npm run dev
   ```

## How It Works

### Rule-Based Reasoning

The agent uses keyword matching and statistical analysis to answer questions:

- **Domain questions**: Analyzes `domainStats` to show top distracting sites
- **Idle time questions**: Uses `idleMinutes` to provide feedback
- **Attention breaks**: Analyzes `attentionBreaks` count
- **Improvement questions**: Generates suggestions based on all metrics
- **Score questions**: Calculates and explains focus score

### Example Questions

- "What are my top distracting domains?"
- "How can I improve my focus?"
- "What's my idle time?"
- "Tell me about my attention breaks"
- "What's my focus score?"

## Architecture

```
React Dashboard → Node.js API → Python FastAPI Agent
```

1. User selects a session in the dashboard
2. Dashboard calls `/api/dashboard/agent/analyze/:sessionId` to initialize context
3. User asks a question
4. Dashboard calls `/api/dashboard/agent/chat` with sessionId and question
5. Node.js forwards to Python agent's `/chat` endpoint
6. Python agent reasons over stored context and returns answer
