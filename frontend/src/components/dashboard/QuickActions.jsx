import "./QuickActions.css";

import { FaUtensils, FaTint, FaRunning } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import ActionButton from "./ActionButton";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">

      <div className="quick-header">
        <h2>⚡ Quick Actions</h2>
        <p>Frequently used shortcuts</p>
      </div>

      <div className="quick-grid">

        <ActionButton
          icon={<FaUtensils />}
          title="Add Meal"
          subtitle="Log your food intake"
          onClick={() => navigate("/add-meal")}
        />

        <ActionButton
          icon={<FaTint />}
          title="Water Tracker"
          subtitle="Coming Soon"
          onClick={() => alert("Water Tracker Coming Soon")}
        />

        <ActionButton
          icon={<FaRunning />}
          title="Exercise"
          subtitle="Coming Soon"
          onClick={() => alert("Exercise Tracker Coming Soon")}
        />

      </div>

    </div>
  );
};

export default QuickActions;