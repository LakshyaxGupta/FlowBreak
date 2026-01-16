import React from 'react';
import './FocusDistributionCard.css';

function FocusDistributionCard({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="focus-distribution-card">
        <h2 className="card-title">Focus Distribution</h2>
        <div className="no-data">
          <p>No focus distribution data available</p>
        </div>
      </div>
    );
  }

  // Count domain occurrences
  const domainCounts = {};
  events.forEach(event => {
    if (event.domain) {
      domainCounts[event.domain] = (domainCounts[event.domain] || 0) + 1;
    }
  });

  // Convert to array and sort by count descending
  const allDomainData = Object.entries(domainCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  if (allDomainData.length === 0) {
    return (
      <div className="focus-distribution-card">
        <h2 className="card-title">Focus Distribution</h2>
        <div className="no-data">
          <p>No focus distribution data available</p>
        </div>
      </div>
    );
  }

  const totalEvents = events.length;
  
  // Get top 3 domains
  const top3Domains = allDomainData.slice(0, 3);
  
  // Calculate "Others" count
  const top3Count = top3Domains.reduce((sum, domain) => sum + domain.count, 0);
  const othersCount = totalEvents - top3Count;

  // Build display data
  const displayData = [...top3Domains];
  
  // Add "Others" if there are remaining domains
  if (othersCount > 0) {
    displayData.push({ name: 'Others', count: othersCount });
  }

  return (
    <div className="focus-distribution-card">
      <h2 className="card-title">Focus Distribution</h2>
      <div className="distribution-list">
        {displayData.map((domain, index) => {
          const percentage = ((domain.count / totalEvents) * 100).toFixed(1);
          let rankClass = '';
          
          if (domain.name === 'Others') {
            rankClass = 'others';
          } else if (index === 0) {
            rankClass = 'gold';
          } else if (index === 1) {
            rankClass = 'silver';
          } else if (index === 2) {
            rankClass = 'bronze';
          }
          
          return (
            <div 
              key={domain.name} 
              className={`distribution-item ${rankClass}`}
            >
              <div className="distribution-info">
                <span className="distribution-domain">{domain.name}</span>
                <span className="distribution-percentage">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FocusDistributionCard;
