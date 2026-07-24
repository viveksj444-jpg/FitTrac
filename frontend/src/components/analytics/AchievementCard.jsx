import React from "react";

const AchievementCard = ({ summary = {} }) => {
  const achievements = [
    {
      title: "Goal Completion Rate",
      value: `${summary.goalCompletion || 0}%`,
      subtext: "Of daily calorie targets met",
      icon: "🏆",
      className: "achieve-completion",
    },
    {
      title: "Longest Healthy Streak",
      value: `${summary.longestHealthyStreak || 0} days`,
      subtext: "Consecutive calorie goals met",
      icon: "🔥",
      className: "achieve-healthy",
    },
    {
      title: "Hydration Streak",
      value: `${summary.longestWaterGoalStreak || 0} days`,
      subtext: "Consecutive water targets hit",
      icon: "💧",
      className: "achieve-water",
    },
    {
      title: "Exercise Streak",
      value: `${summary.longestExerciseStreak || 0} days`,
      subtext: "Consecutive workout days logged",
      icon: "🏋",
      className: "achieve-exercise",
    },
  ];

  return (
    <div className="achievements-section">
      <div className="achievements-header">
        <h3>🏅 Monthly Achievements & Milestones</h3>
        <p className="subtitle">Outstanding streaks and habits you built this month</p>
      </div>
      <div className="achievements-grid">
        {achievements.map((item, idx) => (
          <div key={idx} className={`achievement-card ${item.className}`}>
            <div className="achievement-icon">{item.icon}</div>
            <div className="achievement-info">
              <h4>{item.title}</h4>
              <p className="value">{item.value}</p>
              <p className="subtext">{item.subtext}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementCard;
