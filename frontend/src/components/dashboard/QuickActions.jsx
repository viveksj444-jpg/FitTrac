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
    to: "/meals/add",
  },
  {
    title: "Water",
    icon: <FaTint />,
    to: "/water",
  },
  {
    title: "Exercise",
    icon: <FaRunning />,
    to: "/exercise",
  },
  {
    title: "Reports",
    icon: <FaChartBar />,
    to: "/reports",
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <div className="quick-actions-header">
        <h2>Quick Actions</h2>
        <p>Access your most-used fitness tools.</p>
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