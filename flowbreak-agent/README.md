# FlowBreak Focus Insight Agent

A rule-based, explainable AI agent for analyzing focus sessions and answering user questions.

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the agent
python main.py
```

The agent will run on `http://localhost:8001`

## Endpoints

### POST /analyze
Analyze a session and store context.

**Request:**
```json
{
  "sessionId": "session-123",
  "focusScore": 75.5,
  "maxScore": 100,
  "attentionBreaks": 8,
  "idleMinutes": 12.5,
  "domainStats": {
    "youtube.com": 15,
    "reddit.com": 8,
    "github.com": 20
  }
}
```

### POST /chat
Ask a question about a session.

**Request:**
```json
{
  "sessionId": "session-123",
  "question": "What are my top distracting domains?"
}
```

### GET /health
Health check endpoint.
