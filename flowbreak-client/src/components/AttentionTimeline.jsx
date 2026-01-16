import React from 'react';
import { formatTimeRange } from '../utils/formatTime';
import './AttentionTimeline.css';

function AttentionTimeline({ attentionBreaks }) {
  if (!attentionBreaks || attentionBreaks.length === 0) {
    return (
      <div className="attention-timeline">
        <h2 className="card-title">Attention Breaks</h2>
        <div className="no-breaks">
          <p>No attention breaks detected! Great focus! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attention-timeline">
      <h2 className="card-title">Attention Breaks</h2>
      <div className="breaks-list">
        {attentionBreaks.map((break_, index) => (
          <div key={index} className="break-item">
            <div className="break-header">
              <span className="break-number">#{index + 1}</span>
              <span className="break-time">
                {formatTimeRange(break_.start_time, break_.end_time)}
              </span>
            </div>
            <div className="break-reason">
              <span className="reason-badge">{break_.reason}</span>
            </div>
            {break_.explanation && (
              <div className="break-explanation">
                <p>{break_.explanation}</p>
              </div>
            )}
            {break_.domains && break_.domains.length > 0 && (
              <div className="break-domains">
                <span className="domains-label">Domains:</span>
                <div className="domains-list">
                  {break_.domains.map((domain, i) => (
                    <span key={i} className="domain-tag">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttentionTimeline;
