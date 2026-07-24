import React from "react";
import { FaLightbulb } from "react-icons/fa";

const MonthlyInsights = ({ insights = [] }) => {
  return (
    <div className="analytics-insights-card">
      <div className="insights-header">
        <FaLightbulb className="insight-icon" />
        <div>
          <h3>💡 Personalized Monthly Insights</h3>
          <p className="subtitle">Data-driven observations based on your last 30 days</p>
        </div>
      </div>
      <div className="insights-content">
        {insights.length > 0 ? (
          <ul className="insights-list">
            {insights.map((insight, idx) => (
              <li key={idx} className="insight-item">
                <span className="insight-bullet">•</span>
                <span className="insight-text">{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-insights">
            Log your daily nutrition, water, and exercise to unlock personalized monthly insights.
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyInsights;
