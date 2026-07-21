import React from "react";
import "./NutritionSummary.css";

const NutritionSummary = ({ summary }) => {
  if (!summary) return null;

  const cards = [
    {
      label: "Calories",
      value: summary.calories ?? 0,
      unit: "kcal",
      icon: "🔥",
      color: "#ff6b6b",
    },
    {
      label: "Protein",
      value: summary.protein ?? 0,
      unit: "g",
      icon: "🥩",
      color: "#4ecdc4",
    },
    {
      label: "Carbs",
      value: summary.carbs ?? 0,
      unit: "g",
      icon: "🌾",
      color: "#ffbe0b",
    },
    {
      label: "Fat",
      value: summary.fat ?? 0,
      unit: "g",
      icon: "🥑",
      color: "#ff9f1c",
    },
    {
      label: "Water",
      value: summary.water ?? 0,
      unit: "ml",
      icon: "💧",
      color: "#3a86ff",
    },
  ];

  return (
    <section className="nutrition-summary-section">
      <div className="nutrition-summary-header">
        <h3>📊 Today's Intake Summary</h3>
        <span className="goal-badge">Goal: {summary.goal?.toUpperCase() || "MAINTAIN"}</span>
      </div>

      <div className="nutrition-summary-grid">
        {cards.map((card, idx) => (
          <div key={idx} className="summary-card-item" style={{ borderTopColor: card.color }}>
            <div className="card-top">
              <span className="card-icon">{card.icon}</span>
              <span className="card-label">{card.label}</span>
            </div>
            <div className="card-value-group">
              <span className="card-value">{card.value}</span>
              <span className="card-unit">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NutritionSummary;
