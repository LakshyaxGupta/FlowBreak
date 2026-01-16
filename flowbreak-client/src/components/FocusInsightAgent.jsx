import React, { useState, useEffect } from 'react';
import { analyzeSessionWithAgent, chatWithAgent } from '../api/analytics';
import './FocusInsightAgent.css';

function FocusInsightAgent({ selectedSession }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  // Auto-analyze when session changes
  useEffect(() => {
    if (selectedSession && !analyzed) {
      handleAnalyze();
    }
  }, [selectedSession]);

  const handleAnalyze = async () => {
    if (!selectedSession) return;

    setLoading(true);
    setError(null);

    try {
      await analyzeSessionWithAgent(selectedSession.sessionId, {
        focusScore: selectedSession.focusScore,
        maxScore: selectedSession.maxScore || 100,
        penalty: selectedSession.penalty || 0,
        attentionBreaks: selectedSession.attentionBreaks || 0,
        idleMinutes: selectedSession.idleMinutes || 0,
        events: selectedSession.events || [],
      });
      setAnalyzed(true);
      setAnswer('Session analyzed! Ask me anything about your focus patterns.');
    } catch (err) {
      setError('Failed to analyze session. Agent may be unavailable.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || !selectedSession) return;

    setLoading(true);
    setError(null);

    try {
      const response = await chatWithAgent(selectedSession.sessionId, question);
      setAnswer(response.answer);
      setQuestion('');
    } catch (err) {
      setError('Failed to get answer. Agent may be unavailable.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  if (!selectedSession) {
    return (
      <div className="focus-insight-agent">
        <h2 className="card-title">Focus Insight Agent</h2>
        <div className="no-session">
          <p>Select a session to start analyzing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-insight-agent">
      <h2 className="card-title">Focus Insight Agent</h2>
      
      {!analyzed && (
        <div className="analyze-prompt">
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="analyze-button"
          >
            {loading ? 'Analyzing...' : 'Analyze Session'}
          </button>
        </div>
      )}

      <div className="chat-container">
        <div className="input-group">
          <input
            type="text"
            placeholder="Ask about your focus patterns..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || !analyzed}
            className="question-input"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !analyzed || !question.trim()}
            className="ask-button"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {answer && (
          <div className="answer-container">
            <div className="answer-content">
              {answer.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {!answer && analyzed && (
          <div className="suggestions">
            <p className="suggestions-title">Try asking:</p>
            <ul className="suggestion-list">
              <li>"What are my top distracting domains?"</li>
              <li>"How can I improve my focus?"</li>
              <li>"What's my idle time?"</li>
              <li>"Tell me about my attention breaks"</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FocusInsightAgent;
