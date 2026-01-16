import React, { useState, useEffect } from 'react';
import { getDashboardAnalytics } from '../api/analytics';
import FocusScoreCard from '../components/FocusScoreCard';
import AttentionTimeline from '../components/AttentionTimeline';
import FocusDistributionCard from '../components/FocusDistributionCard';
import FocusInsightAgent from '../components/FocusInsightAgent';
import DomainChart from '../components/DomainChart';
import './Dashboard.css';

function Dashboard() {
  const [email, setEmail] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleLoadAnalytics = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getDashboardAnalytics(email);
      setAnalytics(data);
      if (data.sessions && data.sessions.length > 0) {
        setSelectedSession(data.sessions[0]);
      }
    } catch (err) {
      setError('Failed to load analytics. Make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };


  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>FlowBreak Dashboard</h1>
        <p>Track your focus and attention patterns</p>
      </header>

      <div className="dashboard-controls">
        <div className="email-input-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLoadAnalytics();
            }}
            className="email-input"
          />
          <button
            onClick={handleLoadAnalytics}
            disabled={loading}
            className="load-button"
          >
            {loading ? 'Loading...' : 'Load Analytics'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {analytics && (
        <>
          <div className="overall-stats">
            <div className="stat-card">
              <div className="stat-value">{analytics.overall.totalSessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.overall.avgFocusScore.toFixed(1)}</div>
              <div className="stat-label">Avg Focus Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.overall.totalAttentionBreaks}</div>
              <div className="stat-label">Total Attention Breaks</div>
            </div>
          </div>

          {analytics.sessions && analytics.sessions.length > 0 && (
            <div className="sessions-section">
              <h2>Select Session</h2>
              <div className="sessions-list">
                {analytics.sessions.map((session, index) => {
                  const breakCount = Array.isArray(session.attentionBreaks)
                    ? session.attentionBreaks.length
                    : session.attentionBreaks || 0;

                  return (
                    <button
                      key={session.sessionId}
                      onClick={() => handleSessionSelect(session)}
                      className={`session-button ${
                        selectedSession?.sessionId === session.sessionId ? 'active' : ''
                      }`}
                    >
                      <div className="session-info">
                        <span className="session-number">Session {index + 1}</span>
                        <span className="session-score">Score: {session.focusScore}</span>
                      </div>
                      <span className="session-breaks">
                        {breakCount} breaks
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>
          )}

          {selectedSession && (
            <div className="session-analytics">
              <div className="analytics-grid">
                <div className="grid-item">
                  <FocusScoreCard
                    focusScore={selectedSession.focusScore}
                    maxScore={selectedSession.maxScore}
                    penalty={selectedSession.penalty}
                    attentionBreaks={selectedSession.attentionBreaks}
                    idleMinutes={selectedSession.idleMinutes}
                  />
                </div>
                <div className="grid-item">
                  <AttentionTimeline
                    attentionBreaks={selectedSession.attentionBreakDetails || []}
                  />
                </div>
                <div className="grid-item">
                  <FocusDistributionCard events={selectedSession.events || []} />
                </div>
                <div className="grid-item">
                  <FocusInsightAgent selectedSession={selectedSession} />
                </div>
                <div className="grid-item full-width">
                  <DomainChart events={selectedSession.events || []} />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!analytics && !loading && (
        <div className="welcome-message">
          <p>Enter your email to view your focus analytics</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
