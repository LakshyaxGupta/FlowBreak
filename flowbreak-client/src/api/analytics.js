import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Analyze session with agent
 */
export async function analyzeSessionWithAgent(sessionId, sessionData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dashboard/agent/analyze/${sessionId}`,
      sessionData
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing session with agent:', error);
    throw error;
  }
}

/**
 * Chat with agent about a session
 */
export async function chatWithAgent(sessionId, question) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/dashboard/agent/chat`,
      { sessionId, question }
    );
    return response.data;
  } catch (error) {
    console.error('Error chatting with agent:', error);
    throw error;
  }
}

/**
 * Get dashboard analytics for a user
 */
export async function getDashboardAnalytics(email) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/users/${email}/analytics`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    throw error;
  }
}

/**
 * Get analytics for a specific session
 */
export async function getSessionAnalytics(sessionId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/sessions/${sessionId}/analytics`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching session analytics:', error);
    throw error;
  }
}

/**
 * Ingest events
 */
export async function ingestEvents(email, sessionId, events) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/ingest/events`,
      {
        email,
        sessionId,
        events,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error ingesting events:', error);
    throw error;
  }
}

/**
 * End a session
 */
export async function endSession(sessionId, endTime) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/ingest/sessions/${sessionId}/end`,
      {
        endTime: endTime || new Date().toISOString(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error ending session:', error);
    throw error;
  }
}
