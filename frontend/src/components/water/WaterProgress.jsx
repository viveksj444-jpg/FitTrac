import React from "react";
import "./WaterProgress.css";

const WaterProgress = ({ consumed, goal, remaining, progress }) => {
  const radius = 80;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="water-progress-card">
      <h2 className="water-progress-title">💧 Water Progress</h2>

      <div className="water-progress-circle-container">
        <svg height={radius * 2} width={radius * 2} className="water-svg">
          <circle
            stroke="var(--border)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          <circle
            stroke="var(--secondary)" // Clean vibrant blue from CSS variables
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="water-progress-ring"
          />
        </svg>

        <div className="water-progress-text">
          <h1>{progress}%</h1>
          <p>{consumed} / {goal} ml</p>
        </div>
      </div>

      <div className="water-progress-details">
        <p className="detail-item">
          <span>Goal:</span>
          <strong>{goal} ml</strong>
        </p>

        <p className="detail-item">
          <span>Remaining:</span>
          <strong style={{ color: remaining > 0 ? "var(--secondary)" : "var(--primary)" }}>
            {remaining} ml
          </strong>
        </p>
      </div>
    </div>
  );
};

export default WaterProgress;
