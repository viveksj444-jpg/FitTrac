import "./CalorieProgress.css";

const CalorieProgress = ({ consumed, goal, remaining, progress }) => {
  const radius = 80;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;

  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="progress-card">
      <h2>🔥 Calories</h2>

      <div className="progress-circle">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          <circle
            stroke="#4CAF50"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="progress-ring"
          />
        </svg>

        <div className="progress-text">
          <h1>{progress}%</h1>
          <p>{consumed} kcal</p>
        </div>
      </div>

      <div className="progress-details">
        <p>
          Goal: <strong>{goal} kcal</strong>
        </p>

        <p>
          Remaining: <strong>{remaining} kcal</strong>
        </p>
      </div>
    </div>
  );
};

export default CalorieProgress;