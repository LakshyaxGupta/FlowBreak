import pool from '../db/postgres.js';

/**
 * Reconstruct sessions for a user
 * Groups events by session_id and sorts by timestamp
 */
export async function reconstructSessions(userId) {
  try {
    // Get all sessions for user
    const sessionsResult = await pool.query(
      `SELECT * FROM sessions WHERE user_id = $1 ORDER BY start_time DESC`,
      [userId]
    );

    const sessions = sessionsResult.rows;

    // For each session, get events sorted by timestamp
    const sessionsWithEvents = await Promise.all(
      sessions.map(async (session) => {
        const eventsResult = await pool.query(
          `SELECT * FROM events 
           WHERE session_id = $1 
           ORDER BY timestamp ASC`,
          [session.id]
        );

        return {
          ...session,
          events: eventsResult.rows,
        };
      })
    );

    return sessionsWithEvents;
  } catch (error) {
    console.error('Error reconstructing sessions:', error);
    throw error;
  }
}

/**
 * Get events for a specific session
 */
export async function getSessionEvents(sessionId) {
  try {
    const result = await pool.query(
      `SELECT * FROM events 
       WHERE session_id = $1 
       ORDER BY timestamp ASC`,
      [sessionId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting session events:', error);
    throw error;
  }
}

/**
 * Create a new session
 */
export async function createSession(userId, startTime) {
  try {
    const result = await pool.query(
      `INSERT INTO sessions (user_id, start_time) 
       VALUES ($1, $2) 
       RETURNING *`,
      [userId, startTime]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Update session end time
 */
export async function updateSessionEndTime(sessionId, endTime) {
  try {
    const result = await pool.query(
      `UPDATE sessions 
       SET end_time = $1 
       WHERE id = $2 
       RETURNING *`,
      [endTime, sessionId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
}
