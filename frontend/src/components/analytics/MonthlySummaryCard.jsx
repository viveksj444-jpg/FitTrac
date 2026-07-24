import React from "react";
import { FaUtensils, FaRunning, FaTint, FaChartLine, FaCheckCircle } from "react-icons/fa";

const MonthlySummaryCard = ({ summary }) => {
  const cards = [
    {
      title: "Avg Calories Consumed",
      value: summary?.averageCalories || 0,
      unit: "kcal",
      icon: <FaUtensils />,
      className: "card-consumed",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      title: "Avg Calories Burned",
      value: summary?.averageBurned || 0,
      unit: "kcal",
      icon: <FaRunning />,
      className: "card-burned",
      gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    },
    {
      title: "Avg Net Calories",
      value: summary?.averageNetCalories || 0,
      unit: "kcal",
      icon: <FaChartLine />,
      className: "card-net",
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    },
    {
      title: "Avg Water Intake",
      value: summary?.averageWater || 0,
      unit: "ml",
      icon: <FaTint />,
      className: "card-water",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    },
    {
      title: "Goal Completion Rate",
      value: summary?.goalCompletion || 0,
      unit: "%",
      icon: <FaCheckCircle />,
      className: "card-completion",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
  ];

  return (
    <div className="analytics-summary-grid monthly-summary-grid">
      {cards.map((card, idx) => (
        <div key={idx} className={`analytics-summary-card ${card.className}`}>
          <div className="card-header-icon" style={{ background: card.gradient }}>
            {card.icon}
          </div>
          <div className="card-info">
            <span className="card-title">{card.title}</span>
            <h3 className="card-value">
              {card.value.toLocaleString()} <span className="card-unit">{card.unit}</span>
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlySummaryCard;
