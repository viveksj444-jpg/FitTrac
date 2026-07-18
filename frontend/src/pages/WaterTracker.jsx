import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import WaterProgress from "../components/water/WaterProgress";
import WaterHistory from "../components/water/WaterHistory";
import { getTodayWater, addWater, deleteWaterLog, updateGoal } from "../services/waterService";
import "./WaterTracker.css";

const WaterTracker = () => {
  const [water, setWater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Goal update state
  const [newGoal, setNewGoal] = useState("");
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState("");
  const [goalSuccess, setGoalSuccess] = useState("");

  // Log adding state
  const [customAmount, setCustomAmount] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const fetchWaterData = async () => {
    try {
      const data = await getTodayWater();
      setWater(data);
      setNewGoal(data.goal.toString());
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch today's water details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, []);

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    setGoalError("");
    setGoalSuccess("");
    const goalNum = parseInt(newGoal, 10);

    if (isNaN(goalNum)) {
      setGoalError("Goal must be a valid number.");
      return;
    }

    if (goalNum <= 500) {
      setGoalError("Goal must be greater than 500 ml.");
      return;
    }

    if (goalNum > 10000) {
      setGoalError("Goal cannot exceed 10000 ml.");
      return;
    }

    setGoalLoading(true);
    try {
      const updatedData = await updateGoal(goalNum);
      setWater(updatedData);
      setGoalSuccess("Goal updated successfully!");
      setTimeout(() => setGoalSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setGoalError(err.response?.data?.message || "Failed to update daily goal.");
    } finally {
      setGoalLoading(false);
    }
  };

  const handleAddWater = async (amount) => {
    if (amount <= 0) {
      setAddError("Amount must be greater than 0.");
      return;
    }

    setAddLoading(true);
    setAddError("");
    try {
      const updatedData = await addWater(amount);
      setWater(updatedData);
      setCustomAmount("");
    } catch (err) {
      console.error(err);
      setAddError(err.response?.data?.message || "Failed to add water entry.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    const amountNum = parseInt(customAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAddError("Please enter a valid amount greater than 0 ml.");
      return;
    }
    handleAddWater(amountNum);
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this water log entry?")) {
      return;
    }

    try {
      const updatedData = await deleteWaterLog(logId);
      setWater(updatedData);
    } catch (err) {
      console.error(err);
      alert("Failed to delete log entry.");
    }
  };

  if (loading) {
    return (
      <div className="water-tracker-page-wrapper">
        <Navbar />
        <div className="water-tracker-container loading-state">
          <h2>Loading Water Tracker...</h2>
        </div>
      </div>
    );
  }

  if (error || !water) {
    return (
      <div className="water-tracker-page-wrapper">
        <Navbar />
        <div className="water-tracker-container error-state">
          <h2>Error</h2>
          <p>{error || "Failed to load water data."}</p>
          <button onClick={fetchWaterData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="water-tracker-page-wrapper">
      <Navbar />
      <div className="water-tracker-container">
        <div className="water-tracker-header">
          <h1>💧 Water Intake Tracker</h1>
          <p>Track your daily hydration and hit your target goal</p>
        </div>

        <div className="water-tracker-grid">
          {/* Left Column: Progress & Settings */}
          <div className="water-tracker-left">
            <WaterProgress 
              consumed={water.consumed}
              goal={water.goal}
              remaining={water.remaining}
              progress={water.progress}
            />

            {/* Quick Actions & Add Custom */}
            <div className="water-actions-panel">
              <h3>Add Water Log</h3>
              
              <div className="tracker-quick-buttons">
                <button 
                  onClick={() => handleAddWater(250)}
                  disabled={addLoading}
                  className="quick-add-btn-large"
                >
                  🥛 +250 ml
                </button>
                <button 
                  onClick={() => handleAddWater(500)}
                  disabled={addLoading}
                  className="quick-add-btn-large"
                >
                  🥤 +500 ml
                </button>
                <button 
                  onClick={() => handleAddWater(750)}
                  disabled={addLoading}
                  className="quick-add-btn-large"
                >
                  🍼 +750 ml
                </button>
              </div>

              <form onSubmit={handleCustomAdd} className="custom-add-form">
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Custom amount (ml)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={addLoading}
                    className="custom-amount-input"
                    min="1"
                  />
                  <button type="submit" disabled={addLoading} className="custom-add-btn">
                    Add Log
                  </button>
                </div>
                {addError && <p className="error-text">{addError}</p>}
              </form>
            </div>

            {/* Goal Management Panel */}
            <div className="water-goal-panel">
              <h3>Adjust Target Goal</h3>
              <form onSubmit={handleUpdateGoal} className="goal-form">
                <div className="input-group">
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    disabled={goalLoading}
                    className="goal-input"
                    min="500"
                    max="10000"
                  />
                  <span className="unit-label">ml</span>
                  <button type="submit" disabled={goalLoading} className="goal-submit-btn">
                    {goalLoading ? "Updating..." : "Update"}
                  </button>
                </div>
                {goalError && <p className="error-text">{goalError}</p>}
                {goalSuccess && <p className="success-text">{goalSuccess}</p>}
              </form>
            </div>
          </div>

          {/* Right Column: Logs History */}
          <div className="water-tracker-right">
            <WaterHistory 
              logs={water.logs}
              onDelete={handleDeleteLog}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
