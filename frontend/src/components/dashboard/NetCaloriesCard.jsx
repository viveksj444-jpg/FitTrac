import "./NetCaloriesCard.css";

const NetCaloriesCard = ({
  consumed = 0,
  burned = 0,
  netCalories = 0,
  goal = 2500,
  remaining = 0,
  progress = 0,
}) => {
  const safeConsumed = Math.round(consumed);
  const safeBurned = Math.round(burned);
  const safeNet = Math.round(netCalories);
  const safeGoal = Math.round(goal);
  const safeRemaining = Math.max(0, Math.round(remaining));
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

  // Phase 4 Status Logic
  let statusInfo = {
    icon: "🟢",
    text: "On Track",
    badgeClass: "badge-on-track",
    subtext: null,
  };

  if (safeNet > safeGoal) {
    const exceededBy = safeNet - safeGoal;
    statusInfo = {
      icon: "🔴",
      text: "Over Goal",
      badgeClass: "badge-over-goal",
      subtext: `Exceeded by ${exceededBy} kcal`,
    };
  } else if (safeRemaining === 0 || (safeNet === safeGoal && safeGoal > 0)) {
    statusInfo = {
      icon: "🎉",
      text: "Goal Reached",
      badgeClass: "badge-goal-reached",
      subtext: null,
    };
  } else {
    statusInfo = {
      icon: "🟢",
      text: "On Track",
      badgeClass: "badge-on-track",
      subtext: null,
    };
  }

  return (
    <div className="net-calories-card">
      <div className="net-card-header">
        <h2>🔥 Net Calories</h2>
        <span className="centerpiece-tag">Centerpiece</span>
      </div>

      <div className="net-card-body">
        <div className="stats-section primary-stats">
          <div className="stat-row">
            <span className="stat-label">Consumed</span>
            <span className="stat-value consumed-color">{safeConsumed} kcal</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Burned</span>
            <span className="stat-value burned-color">{safeBurned} kcal</span>
          </div>
        </div>

        <div className="stat-divider" />

        <div className="stats-section summary-stats">
          <div className="stat-row highlight">
            <span className="stat-label">Net</span>
            <span className="stat-value net-color">{safeNet} kcal</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Goal</span>
            <span className="stat-value">{safeGoal} kcal</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Remaining</span>
            <span className="stat-value remaining-color">{safeRemaining} kcal</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-header">
            <span>Daily Progress</span>
            <span className="progress-percentage">{safeProgress}%</span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${statusInfo.badgeClass}`}
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>

        <div className="status-footer">
          <div className={`status-badge ${statusInfo.badgeClass}`}>
            <span className="status-icon">{statusInfo.icon}</span>
            <span className="status-text">{statusInfo.text}</span>
          </div>
          {statusInfo.subtext && (
            <p className="status-subtext">{statusInfo.subtext}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetCaloriesCard;
