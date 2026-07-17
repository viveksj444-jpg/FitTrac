import "./MacroCard.css";

const MacroCard = ({ title, consumed, goal, progress, color }) => {
  return (
    <div className="macro-card">
      <div className="macro-header">
        <h3>{title}</h3>
        <span>{Number(consumed).toFixed(1).replace(/\.0$/, "")} g</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>

      <div className="macro-footer">
        <span>Goal: {goal} g</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

export default MacroCard;