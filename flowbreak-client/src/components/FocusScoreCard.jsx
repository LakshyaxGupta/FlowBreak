import React from 'react';
import './FocusScoreCard.css';

function FocusScoreCard({ focusScore, maxScore, penalty, attentionBreaks, idleMinutes }) {
  const percentage = (focusScore / maxScore) * 100;
  
  // Determine color based on score
  let scoreColor = '#4caf50'; // green
  if (percentage < 50) {
    scoreColor = '#f44336'; // red
  } else if (percentage < 75) {
    scoreColor = '#ff9800'; // orange
  }

  return (
    <div className="focus-score-card">
      <h2 className="card-title">Focus Score</h2>
      <div className="score-display">
        <div 
          className="score-circle"
          style={{
            background: `conic-gradient(${scoreColor} ${percentage * 3.6}deg, #e0e0e0 0deg)`,
          }}
        >
          <div className="score-inner">
            <span className="score-value">{focusScore}</span>
            <span className="score-max">/ {maxScore}</span>
          </div>
        </div>
      </div>
      <div className="score-details">
        <div className="detail-item">
          <span className="detail-label">Penalty:</span>
          <span className="detail-value">-{penalty.toFixed(1)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Attention Breaks:</span>
          <span className="detail-value">{attentionBreaks}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Idle Time:</span>
          <span className="detail-value">{idleMinutes.toFixed(1)} min</span>
        </div>
      </div>
    </div>
  );
}

export default FocusScoreCard;
