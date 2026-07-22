import React from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaRunning, FaTint, FaUtensils, FaDumbbell } from "react-icons/fa";

const WeeklyInsights = ({ insights = [] }) => {
  // Helper to determine icon based on insight text keywords
  const getInsightIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("calorie goal") || lower.includes("reached your goal")) {
      return <FaCheckCircle className="insight-icon icon-goal-met" />;
    }
    if (lower.includes("active day") || lower.includes("most active")) {
      return <FaRunning className="insight-icon icon-active-day" />;
    }
    if (lower.includes("protein") || lower.includes("intake increased") || lower.includes("protein intake")) {
      return <FaDumbbell className="insight-icon icon-protein" />;
    }
    if (lower.includes("water") || lower.includes("below target")) {
      return <FaTint className="insight-icon icon-water-warning" />;
    }
    if (lower.includes("deficit")) {
      return <FaUtensils className="insight-icon icon-deficit" />;
    }
    return <FaInfoCircle className="insight-icon icon-default" />;
  };

  return (
    <div className="weekly-insights-container">
      <h3>💡 Personalized Insights</h3>
      {insights.length === 0 ? (
        <p className="no-insights">No insights available this week. Keep logging to get dynamic feedback!</p>
      ) : (
        <ul className="insights-list">
          {insights.map((insight, idx) => (
            <li key={idx} className="insight-item">
              <div className="insight-icon-container">
                {getInsightIcon(insight)}
              </div>
              <p className="insight-text">{insight}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeeklyInsights;
