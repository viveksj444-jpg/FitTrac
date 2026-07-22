import React from "react";
import { FaUtensils, FaDumbbell, FaArrowUp, FaArrowDown, FaCalendarCheck, FaCalendarMinus } from "react-icons/fa";

const ActivityCard = ({ summary }) => {
  const stats = [
    {
      label: "Total Meals Logged",
      value: summary?.totalMeals || 0,
      icon: <FaUtensils className="icon-meal" />,
    },
    {
      label: "Total Workouts",
      value: summary?.totalExercises || 0,
      icon: <FaDumbbell className="icon-exercise" />,
    },
    {
      label: "Highest Calorie Day",
      value: summary?.highestCalorieDay || "N/A",
      icon: <FaArrowUp className="icon-high-cal" />,
    },
    {
      label: "Lowest Calorie Day",
      value: summary?.lowestCalorieDay || "N/A",
      icon: <FaArrowDown className="icon-low-cal" />,
    },
    {
      label: "Most Active Day",
      value: summary?.mostActiveDay || "N/A",
      icon: <FaCalendarCheck className="icon-active" />,
    },
    {
      label: "Least Active Day",
      value: summary?.leastActiveDay || "N/A",
      icon: <FaCalendarMinus className="icon-inactive" />,
    },
  ];

  return (
    <div className="activity-card-container">
      <h3>📋 Weekly Statistics</h3>
      <div className="activity-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="activity-stat-item">
            <div className="stat-icon-wrapper">{stat.icon}</div>
            <div className="stat-text">
              <span className="stat-label">{stat.label}</span>
              <strong className="stat-value">{stat.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;
