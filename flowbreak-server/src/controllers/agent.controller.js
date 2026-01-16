import axios from 'axios';

const AGENT_URL = process.env.AGENT_URL;

/**
 * Analyze a session and send data to Python agent
 */
export async function analyzeSession(req, res) {
  try {
    const { sessionId } = req.params;
    const { focusScore, maxScore, penalty, attentionBreaks, idleMinutes, events } = req.body;

    if (!sessionId || focusScore === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, focusScore',
      });
    }

    // Calculate domain stats from events
    const domainStats = {};
    if (events && Array.isArray(events)) {
      events.forEach(event => {
        if (event.domain) {
          domainStats[event.domain] = (domainStats[event.domain] || 0) + 1;
        }
      });
    }

    // Call Python agent
    try {
      const agentResponse = await axios.post(`${AGENT_URL}/analyze`, {
        sessionId,
        focusScore,
        maxScore: maxScore || 100,
        attentionBreaks: Array.isArray(attentionBreaks) ? attentionBreaks.length : (attentionBreaks || 0),
        idleMinutes: idleMinutes || 0,
        domainStats,
        events: events || [],
      });

      res.json(agentResponse.data);
    } catch (agentError) {
      console.error('Agent error:', agentError.message);
      // Return fallback response if agent is unavailable
      res.status(503).json({
        error: 'Agent service unavailable',
        message: agentError.message,
      });
    }
  } catch (error) {
    console.error('Error analyzing session:', error);
    res.status(500).json({
      error: 'Failed to analyze session',
      message: error.message,
    });
  }
}

/**
 * Chat with agent about a session
 */
export async function chatWithAgent(req, res) {
  try {
    const { sessionId, question } = req.body;

    if (!sessionId || !question) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, question',
      });
    }

    // Call Python agent
    try {
      const agentResponse = await axios.post(`${AGENT_URL}/chat`, {
        sessionId,
        question,
      });

      res.json(agentResponse.data);
    } catch (agentError) {
      console.error('Agent error:', agentError.message);
      res.status(503).json({
        error: 'Agent service unavailable',
        message: agentError.message,
      });
    }
  } catch (error) {
    console.error('Error chatting with agent:', error);
    res.status(500).json({
      error: 'Failed to chat with agent',
      message: error.message,
    });
  }
}
