import "./QuickActions.css";

import {
  FaUtensils,
  FaTint,
  FaRunning,
  FaChartBar,
} from "react-icons/fa";

import ActionButton from "./ActionButton";

const actions = [
  {
    title: "Add Meal",
    icon: <FaUtensils />,
    to: "/add-meal",
  },
  {
    title: "Water",
    icon: <FaTint />,
    to: "/water-tracker",
  },
  {
    title: "Exercise",
    subtitle: "Coming Soon",
    icon: <FaRunning />,
    onClick: () =>
      alert("🏃 Exercise Tracker is coming soon!"),
  },
  {
    title: "Reports",
    subtitle: "Coming Soon",
    icon: <FaChartBar />,
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