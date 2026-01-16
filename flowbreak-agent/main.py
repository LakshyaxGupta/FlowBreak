from dotenv import load_dotenv
import os

load_dotenv()


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import re

app = FastAPI(title="FlowBreak Focus Insight Agent")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session context storage
session_contexts: Dict[str, dict] = {}


class AnalyzeRequest(BaseModel):
    sessionId: str
    focusScore: float
    maxScore: Optional[float] = 100
    attentionBreaks: int
    idleMinutes: float
    domainStats: Dict[str, int]
    events: Optional[List[dict]] = None


class AnalyzeResponse(BaseModel):
    summary: str
    primaryIssue: str
    status: str


class ChatRequest(BaseModel):
    sessionId: str
    question: str


class ChatResponse(BaseModel):
    answer: str
    reasoning: Optional[str] = None


def analyze_session(data: AnalyzeRequest) -> AnalyzeResponse:
    """Analyze session data and identify primary issues."""
    score_percentage = (data.focusScore / data.maxScore) * 100
    
    # Calculate domain distribution
    total_events = sum(data.domainStats.values())
    top_domains = sorted(
        data.domainStats.items(),
        key=lambda x: x[1],
        reverse=True
    )[:3]
    
    # Determine primary issue
    issues = []
    
    if score_percentage < 50:
        issues.append("low_focus_score")
    elif score_percentage < 75:
        issues.append("moderate_focus_score")
    
    if data.attentionBreaks > 10:
        issues.append("high_attention_breaks")
    elif data.attentionBreaks > 5:
        issues.append("moderate_attention_breaks")
    
    if data.idleMinutes > 30:
        issues.append("high_idle_time")
    elif data.idleMinutes > 15:
        issues.append("moderate_idle_time")
    
    # Determine primary issue
    if "low_focus_score" in issues:
        primary_issue = "Low focus score"
    elif "high_attention_breaks" in issues:
        primary_issue = "Too many attention breaks"
    elif "high_idle_time" in issues:
        primary_issue = "Excessive idle time"
    elif "moderate_focus_score" in issues:
        primary_issue = "Moderate focus performance"
    else:
        primary_issue = "Good focus performance"
    
    # Generate summary
    top_domain_names = [d[0] for d in top_domains]
    summary = (
        f"Focus Score: {data.focusScore:.1f}/{data.maxScore:.1f} ({score_percentage:.1f}%). "
        f"Attention breaks: {data.attentionBreaks}. "
        f"Idle time: {data.idleMinutes:.1f} minutes. "
        f"Top domains: {', '.join(top_domain_names[:2]) if top_domain_names else 'N/A'}."
    )
    
    return AnalyzeResponse(
        summary=summary,
        primaryIssue=primary_issue,
        status="analyzed"
    )


def answer_question(session_id: str, question: str) -> ChatResponse:
    """Answer user question using rule-based reasoning."""
    if session_id not in session_contexts:
        return ChatResponse(
            answer="No session data available. Please analyze a session first.",
            reasoning="Session context not found"
        )
    
    context = session_contexts[session_id]
    question_lower = question.lower()
    
        # WHY focus was low
    if "focus" in question_lower and any(word in question_lower for word in ["low", "bad", "poor"]):
        reasons = []

        breaks = context.get("attentionBreaks", 0)
        idle = context.get("idleMinutes", 0)
        score = context.get("focusScore", 0)
        max_score = context.get("maxScore", 100)
        domain_stats = context.get("domainStats", {})

        if breaks > 5:
            reasons.append(f"{breaks} attention breaks")

        if idle > 15:
            reasons.append(f"{idle:.1f} minutes of idle time")

        if domain_stats:
            top_domain = max(domain_stats.items(), key=lambda x: x[1])[0]
            reasons.append(f"heavy usage of {top_domain}")

        if not reasons:
            reasons.append("minor distractions across the session")

        return ChatResponse(
            answer=(
                f"Your focus score was low ({score:.1f}/{max_score:.1f}) because of "
                + ", ".join(reasons) + "."
            ),
            reasoning="Derived from attention breaks, idle time, and domain distribution"
        )


    # Domain-related questions
    if any(word in question_lower for word in ["youtube", "domain", "website", "site", "visit"]):
        domain_stats = context.get("domainStats", {})
        if not domain_stats:
            return ChatResponse(
                answer="No domain statistics available for this session.",
                reasoning="Domain stats missing"
            )
        
        top_domains = sorted(
            domain_stats.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        total = sum(domain_stats.values())
        response_parts = ["Top distracting domains:\n"]
        for domain, count in top_domains:
            percentage = (count / total * 100) if total > 0 else 0
            response_parts.append(f"• {domain}: {count} visits ({percentage:.1f}%)")
        
        return ChatResponse(
            answer="\n".join(response_parts),
            reasoning=f"Analyzed {len(domain_stats)} domains from session data"
        )
    
    # Idle time questions
    if any(word in question_lower for word in ["idle", "inactive", "away", "pause"]):
        idle_minutes = context.get("idleMinutes", 0)
        total_minutes = context.get("totalMinutes", 0)
        
        if idle_minutes > 30:
            advice = "You had significant idle time. Try setting timers or using focus apps to stay engaged."
        elif idle_minutes > 15:
            advice = "Moderate idle time detected. Consider shorter work intervals to maintain focus."
        else:
            advice = "Your idle time is within acceptable limits. Good job staying active!"
        
        return ChatResponse(
            answer=f"Idle time: {idle_minutes:.1f} minutes. {advice}",
            reasoning=f"Calculated from session idleMinutes: {idle_minutes}"
        )
    
    # Attention breaks questions
    if any(word in question_lower for word in ["break", "distraction", "interrupt", "switch"]):
        breaks = context.get("attentionBreaks", 0)
        score = context.get("focusScore", 0)
        max_score = context.get("maxScore", 100)
        
        if breaks > 10:
            advice = "You had many attention breaks. Try using website blockers or focus timers."
        elif breaks > 5:
            advice = "Moderate number of breaks. Consider planning focused work blocks."
        else:
            advice = "Good focus! You maintained attention well during this session."
        
        return ChatResponse(
            answer=f"Attention breaks: {breaks}. Focus score: {score:.1f}/{max_score:.1f}. {advice}",
            reasoning=f"Analyzed {breaks} breaks from session data"
        )
    
    # Improvement questions
    if any(word in question_lower for word in ["improve", "better", "suggest", "recommend", "help", "advice"]):
        suggestions = []
        
        score = context.get("focusScore", 0)
        max_score = context.get("maxScore", 100)
        score_pct = (score / max_score * 100) if max_score > 0 else 0
        
        breaks = context.get("attentionBreaks", 0)
        idle = context.get("idleMinutes", 0)
        domain_stats = context.get("domainStats", {})
        
        if score_pct < 75:
            suggestions.append("• Work on reducing distractions to improve focus score")
        
        if breaks > 5:
            suggestions.append("• Use website blockers for distracting sites")
            suggestions.append("• Try the Pomodoro technique (25 min focus, 5 min break)")
        
        if idle > 15:
            suggestions.append("• Set regular timers to stay engaged")
            suggestions.append("• Break work into smaller, manageable chunks")
        
        if domain_stats:
            top_distractor = max(domain_stats.items(), key=lambda x: x[1])[0]
            suggestions.append(f"• Consider blocking or limiting {top_distractor} during focus time")
        
        if not suggestions:
            suggestions.append("• Keep up the good work! Your focus metrics look healthy.")
        
        return ChatResponse(
            answer="Suggestions to improve focus:\n" + "\n".join(suggestions),
            reasoning=f"Generated from score: {score_pct:.1f}%, breaks: {breaks}, idle: {idle:.1f}min"
        )
    
    # Score questions
    if any(word in question_lower for word in ["score", "performance", "how well", "rating"]):
        score = context.get("focusScore", 0)
        max_score = context.get("maxScore", 100)
        score_pct = (score / max_score * 100) if max_score > 0 else 0
        
        if score_pct >= 90:
            rating = "Excellent"
        elif score_pct >= 75:
            rating = "Good"
        elif score_pct >= 50:
            rating = "Fair"
        else:
            rating = "Needs Improvement"
        
        return ChatResponse(
            answer=f"Focus Score: {score:.1f}/{max_score:.1f} ({score_pct:.1f}%) - {rating}",
            reasoning=f"Calculated percentage from focusScore and maxScore"
        )
    
    # Default response
    return ChatResponse(
        answer=(
            "I can help you understand:\n"
            "• Focus score and performance\n"
            "• Attention breaks and distractions\n"
            "• Idle time patterns\n"
            "• Top distracting domains\n"
            "• Suggestions for improvement\n\n"
            "Try asking about any of these topics!"
        ),
        reasoning="Default response for unrecognized question pattern"
    )


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(data: AnalyzeRequest):
    """Analyze session data and store context."""
    try:
        # Store session context
        session_contexts[data.sessionId] = {
            "sessionId": data.sessionId,
            "focusScore": data.focusScore,
            "maxScore": data.maxScore,
            "attentionBreaks": data.attentionBreaks,
            "idleMinutes": data.idleMinutes,
            "domainStats": data.domainStats,
            "events": data.events or []
        }
        
        # Analyze and return
        result = analyze_session(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Answer user question about session."""
    try:
        result = answer_question(request.sessionId, request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "sessions": len(session_contexts)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("AGENT_HOST", "127.0.0.1"),
        port=int(os.getenv("AGENT_PORT", 8001))
    )
