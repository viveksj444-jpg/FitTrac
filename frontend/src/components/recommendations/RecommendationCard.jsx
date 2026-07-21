import React from "react";
import FoodSuggestionCard from "./FoodSuggestionCard";
import "./RecommendationCard.css";

const getTypeIcon = (type) => {
  switch (type) {
    case "protein":
      return "🍗";
    case "calories_low":
      return "🍲";
    case "calories_high":
      return "⚠️";
    case "fat":
      return "🥑";
    case "carbs":
      return "🌾";
    case "water":
      return "💧";
    case "goal_strategy":
      return "🎯";
    default:
      return "💡";
  }
};

const getBadgeClass = (badgeStr) => {
  if (!badgeStr) return "badge-default";
  if (badgeStr.includes("🟢") || badgeStr.toLowerCase().includes("excellent")) {
    return "badge-excellent";
  }
  if (badgeStr.includes("🟡") || badgeStr.toLowerCase().includes("improve")) {
    return "badge-improve";
  }
  if (badgeStr.includes("🔴") || badgeStr.toLowerCase().includes("attention")) {
    return "badge-attention";
  }
  return "badge-info";
};

const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const { type, title, description, badge, foods, tips } = recommendation;
  const icon = getTypeIcon(type);
  const badgeClass = getBadgeClass(badge);

  return (
    <div className="recommendation-card">
      <div className="rec-card-header">
        <div className="rec-card-title-group">
          <span className="rec-card-icon">{icon}</span>
          <h3 className="rec-card-title">{title}</h3>
        </div>
        {badge && (
          <span className={`rec-badge ${badgeClass}`}>
            {badge}
          </span>
        )}
      </div>

      <p className="rec-card-description">{description}</p>

      {/* Suggested Foods */}
      {foods && foods.length > 0 && (
        <FoodSuggestionCard foods={foods} />
      )}

      {/* Actionable Tips */}
      {tips && tips.length > 0 && (
        <div className="rec-tips-container">
          <h4 className="rec-tips-title">📌 Key Action Steps:</h4>
          <ul className="rec-tips-list">
            {tips.map((tip, index) => (
              <li key={index} className="rec-tip-item">
                <span className="tip-bullet">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
