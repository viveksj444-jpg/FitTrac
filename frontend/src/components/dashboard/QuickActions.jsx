import "./QuickActions.css";
import ActionButton from "./ActionButton";

const UtensilsIcon = () => <span>🍽️</span>;
const WaterIcon = () => <span>💧</span>;
const RunningIcon = () => <span>🏃</span>;
const ChartIcon = () => <span>📊</span>;

const actions = [
  {
    title: "Add Meal",
    icon: <UtensilsIcon />,
    to: "/add-meal",
  },
  {
    title: "Water",
    icon: <WaterIcon />,
    to: "/water-tracker",
  },
  {
    title: "Exercise",
    subtitle: "Coming Soon",
    icon: <RunningIcon />,
    onClick: () =>
      alert("🏃 Exercise Tracker is coming soon!"),
  },
  {
    title: "Reports",
    subtitle: "Coming Soon",
    icon: <ChartIcon />,
    onClick: () =>
      alert("📊 Reports are coming soon!"),
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <div className="quick-actions-header">
        <h2>⚡ Quick Actions</h2>

        <p>
          Access your most-used fitness tools.
        </p>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <ActionButton
            key={action.title}
            {...action}
          />
        ))}
      </div>
    </section>
  );
};

export default QuickActions;