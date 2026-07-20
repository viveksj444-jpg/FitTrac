import "./DashboardInsights.css";

const DashboardInsights = ({
  burned = 0,
  remaining = 0,
  netCalories = 0,
  goal = 2500,
  macros = {},
}) => {
  const safeBurned = Math.round(burned);
  const safeRemaining = Math.round(remaining);
  const safeNet = Math.round(netCalories);
  const safeGoal = Math.round(goal);

  const insights = [];

  // Insight 1: Burned calories recommendation
  if (safeBurned > 0) {
    insights.push({
      type: "success",
      icon: "💪",
      title: "Active Day",
      message: `Great job! You burned ${safeBurned} kcal today.`,
    });
  }

  // Insight 2: Surplus vs Remaining
  if (safeNet > safeGoal) {
    const exceededBy = safeNet - safeGoal;
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: "Calorie Surplus",
      message: `You're ${exceededBy} kcal above your daily goal.`,
    });
  } else if (safeRemaining > 0) {
    insights.push({
      type: "info",
      icon: "🎯",
      title: "Budget Status",
      message: `You have ${safeRemaining} kcal remaining today.`,
    });
  } else if (safeRemaining === 0) {
    insights.push({
      type: "success",
      icon: "🎉",
      title: "Target Hit",
      message: "Spot on! You have hit your exact daily calorie goal.",
    });
  }

  // Insight 3: Protein check
  const proteinProgress = macros?.protein?.progress || 0;
  if (proteinProgress < 60) {
    insights.push({
      type: "tip",
      icon: "🥚",
      title: "Protein Intake",
      message: "Protein intake is low. Consider adding a high-protein snack.",
    });
  } else {
    insights.push({
      type: "success",
      icon: "🍗",
      title: "Protein On Track",
      message: "Excellent protein intake today! Supports muscle recovery.",
    });
  }

  return (
    <div className="dashboard-insights">
      <div className="insights-header">
        <h3>💡 Smart Recommendations & Insights</h3>
      </div>

      <div className="insights-grid">
        {insights.map((item, idx) => (
          <div key={idx} className={`insight-card insight-${item.type}`}>
            <span className="insight-icon">{item.icon}</span>
            <div className="insight-text">
              <span className="insight-title">{item.title}</span>
              <p className="insight-message">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardInsights;
