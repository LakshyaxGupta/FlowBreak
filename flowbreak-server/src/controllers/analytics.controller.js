import pool from '../db/postgres.js';
import { reconstructSessions } from '../services/session.service.js';
import { getSessionAnalytics } from '../services/score.service.js';

/**
 * Get dashboard analytics for a user
 */
export async function getDashboardAnalytics(req, res) {
  try {
    const { email } = req.params;

    // Get user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Reconstruct sessions with events
    const sessions = await reconstructSessions(user.id);

    // Calculate analytics for each session
    const sessionsWithAnalytics = sessions.map(session => {
      const analytics = getSessionAnalytics(session.events || []);
      
      return {
        sessionId: session.id,
        startTime: session.start_time,
        endTime: session.end_time,
        events: session.events || [],
        ...analytics,
      };
    });

    // Calculate overall stats
    const totalSessions = sessionsWithAnalytics.length;
    const avgFocusScore = totalSessions > 0
      ? sessionsWithAnalytics.reduce((sum, s) => sum + s.focusScore, 0) / totalSessions
      : 0;
    const totalAttentionBreaks = sessionsWithAnalytics.reduce(
      (sum, s) => sum + (Array.isArray(s.attentionBreaks)
        ? s.attentionBreaks.length
        : s.attentionBreaks || 0),
      0
    );


    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      overall: {
        totalSessions,
        avgFocusScore: Math.round(avgFocusScore * 10) / 10,
        totalAttentionBreaks,
      },
      sessions: sessionsWithAnalytics,
    });
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    res.status(500).json({
      error: 'Failed to get dashboard analytics',
      message: error.message,
    });
  }
}

/**
 * Get analytics for a specific session
 */
export async function getSessionAnalyticsController(req, res) {
  try {
    const { sessionId } = req.params;

    // Get session
    const sessionResult = await pool.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Session not found',
      });
    }

    const session = sessionResult.rows[0];

    // Get events
    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE session_id = $1 ORDER BY timestamp ASC',
      [sessionId]
    );

    const events = eventsResult.rows;
    const analytics = getSessionAnalytics(events);

    res.json({
      session: {
        id: session.id,
        startTime: session.start_time,
        endTime: session.end_time,
      },
      events: events,
      ...analytics,
    });
  } catch (error) {
    console.error('Error getting session analytics:', error);
    res.status(500).json({
      error: 'Failed to get session analytics',
      message: error.message,
    });
  }
}
