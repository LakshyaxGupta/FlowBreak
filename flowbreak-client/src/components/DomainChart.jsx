import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './DomainChart.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

function DomainChart({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="domain-chart">
        <h2 className="card-title">Domain Distribution</h2>
        <div className="no-data">
          <p>No domain data available</p>
        </div>
      </div>
    );
  }

  // Count domain visits
  const domainCounts = {};
  events.forEach(event => {
    if (event.domain) {
      domainCounts[event.domain] = (domainCounts[event.domain] || 0) + 1;
    }
  });

  // Convert to array and sort by count
  const domainData = Object.entries(domainCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 domains

  if (domainData.length === 0) {
    return (
      <div className="domain-chart">
        <h2 className="card-title">Domain Distribution</h2>
        <div className="no-data">
          <p>No domain data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="domain-chart">
      <h2 className="card-title">Domain Distribution</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={domainData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {domainData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="domain-list">
        {domainData.map((domain, index) => (
          <div key={index} className="domain-item">
            <div 
              className="domain-color" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="domain-name">{domain.name}</span>
            <span className="domain-count">{domain.value} visits</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DomainChart;
