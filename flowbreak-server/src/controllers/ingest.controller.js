import pool from '../db/postgres.js';
import { createSession, updateSessionEndTime } from '../services/session.service.js';

/**
 * Create or get user by email
 */
async function getOrCreateUser(email) {
  try {
    // Try to get existing user
    let result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Create new user
    result = await pool.query(
      'INSERT INTO users (email) VALUES ($1) RETURNING *',
      [email]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error getting/creating user:', error);
    throw error;
  }
}

/**
 * Ingest events from client
 */
export async function ingestEvents(req, res) {
  const client = await pool.connect();

  try {
    const { email, sessionId, events } = req.body;

    if (!email || !events || !Array.isArray(events)) {
      return res.status(400).json({
        error: 'Missing required fields: email and events array',
      });
    }

    await client.query("BEGIN");

    // 1️⃣ Get or create user
    let userResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
    } else {
      const insertUser = await client.query(
        'INSERT INTO users (email) VALUES ($1) RETURNING *',
        [email]
      );
      user = insertUser.rows[0];
    }

    // 2️⃣ Get or create session
    let session;
    if (sessionId) {
    const sessionResult = await client.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionResult.rows.length > 0) {
      session = sessionResult.rows[0];
    } else {
      // Create session if it doesn't exist
      const startTime = events[0]?.timestamp || new Date().toISOString();
      const newSession = await client.query(
        `INSERT INTO sessions (id, user_id, start_time)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [sessionId, user.id, startTime]
      );
      session = newSession.rows[0];
    }
  }


    // 3️⃣ Insert events
    for (const event of events) {
      await client.query(
        `INSERT INTO events (session_id, event_type, domain, timestamp)
         VALUES ($1, $2, $3, $4)`,
        [session.id, event.event_type, event.domain || null, event.timestamp]
      );
    }

    // 4️⃣ Update session end time
    if (events.length > 0) {
      const latestEventTime = events.reduce((latest, curr) =>
        new Date(curr.timestamp) > new Date(latest) ? curr.timestamp : latest
      , events[0].timestamp);

      await client.query(
        'UPDATE sessions SET end_time = $1 WHERE id = $2',
        [latestEventTime, session.id]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      sessionId: session.id,
      eventsIngested: events.length,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error ingesting events:", error);

    res.status(500).json({
      error: "Failed to ingest events",
      message: error.message,
    });
  } finally {
    client.release();
  }
}


/**
 * End a session
 */
export async function endSession(req, res) {
  try {
    const { sessionId } = req.params;
    const { endTime } = req.body;

    const session = await updateSessionEndTime(
      sessionId,
      endTime || new Date().toISOString()
    );

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({
      error: 'Failed to end session',
      message: error.message,
    });
  }
}
