import React from "react";
import { FaTrophy } from "react-icons/fa";

const GoalCompletionCard = ({ completionRate = 0, totalDays = 7 }) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  // Calculate days completed based on the rate (e.g. 71% of 7 = 5 days)
  const completedDays = Math.round((completionRate / 100) * totalDays);

  return (
    <div className="goal-completion-card">
      <div className="goal-card-header">
        <FaTrophy className="goal-trophy-icon" />
        <h4>Goal Completion</h4>
      </div>
      <div className="goal-progress-container">
        <svg className="goal-progress-svg" viewBox="0 0 120 120">
          <circle
            className="goal-progress-bg"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="goal-progress-bar"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="goal-progress-text">
          <span className="percentage">{completionRate}%</span>
          <span className="label">Weekly Goal</span>
        </div>
      </div>
      <div className="goal-stats">
        <p>
          You reached your calorie goals on <strong>{completedDays}</strong> out of <strong>{totalDays}</strong> days this week.
        </p>
      </div>
    </div>
  );
};

export default GoalCompletionCard;
