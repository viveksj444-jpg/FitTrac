import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTodayWater, addWater, updateGoal } from "../../services/waterService";
import "./WaterCard.css";

const WaterCard = () => {
  const [water, setWater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalValue, setEditGoalValue] = useState("");
  const [goalError, setGoalError] = useState("");

  const fetchWaterData = async () => {
    try {
      const data = await getTodayWater();
      setWater(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load water data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, []);

  const handleQuickAdd = async (amount) => {
    if (adding) return;
    setAdding(true);
    
    // Optimistic update for instant feedback
    const prevWater = { ...water };
    if (water) {
      const newConsumed = water.consumed + amount;
      const newProgress = water.goal > 0 ? Math.min(100, Math.round((newConsumed / water.goal) * 100)) : 0;
      const newRemaining = Math.max(0, water.goal - newConsumed);
      
      setWater({
        ...water,
        consumed: newConsumed,
        progress: newProgress,
        remaining: newRemaining,
        logs: [...water.logs, { amount, time: "Just now", _id: "temp-id" }]
      });
    }

    try {
      const updatedData = await addWater(amount);
      setWater(updatedData);
    } catch (err) {
      console.error(err);
      // Revert on error
      setWater(prevWater);
      alert("Failed to add water entry. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleGoalSubmit = async (e) => {
    if (e) e.preventDefault();
    setGoalError("");
    
    let finalGoal = 3000; // Default goal
    if (editGoalValue.trim() !== "") {
      const parsedGoal = parseInt(editGoalValue, 10);
      if (isNaN(parsedGoal)) {
        setGoalError("Must be a number");
        return;
      }
      if (parsedGoal <= 500) {
        setGoalError("Must be > 500 ml");
        return;
      }
      if (parsedGoal > 10000) {
        setGoalError("Max 10000 ml");
        return;
      }
      finalGoal = parsedGoal;
    }

    try {
      const updatedData = await updateGoal(finalGoal);
      setWater(updatedData);
      setIsEditingGoal(false);
    } catch (err) {
      console.error(err);
      setGoalError(err.response?.data?.message || "Failed to update goal");
    }
  };

  if (loading) {
    return (
      <div className="water-card loading-card">
        <h3>💧 Water</h3>
        <p>Loading today's water...</p>
      </div>
    );
  }

  if (error || !water) {
    return (
      <div className="water-card error-card">
        <h3>💧 Water</h3>
        <p>{error || "Error loading water tracker"}</p>
      </div>
    );
  }

  const { consumed, goal, remaining, progress } = water;

  return (
    <div className="water-card">
      <div className="water-card-header">
        <div>
          <h2>💧 Water</h2>
          <p className="water-subtitle">Stay hydrated today</p>
        </div>
        <Link to="/water-tracker" className="detail-link-btn">
          View Logs
        </Link>
      </div>

      <div className="water-status-container">
        <div className="water-status-text">
          <span className="water-consumed-ratio">
            <strong>{consumed}</strong>
            {isEditingGoal ? (
              <form onSubmit={handleGoalSubmit} style={{ display: "inline-flex", alignItems: "center", marginLeft: "5px", gap: "5px" }}>
                <span>/</span>
                <input
                  type="number"
                  value={editGoalValue}
                  onChange={(e) => setEditGoalValue(e.target.value)}
                  placeholder="3000"
                  style={{
                    width: "70px",
                    padding: "2px 5px",
                    fontSize: "14px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    outline: "none"
                  }}
                  autoFocus
                />
                <span style={{ fontSize: "14px" }}>ml</span>
                <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }} title="Save">💾</button>
                <button type="button" onClick={() => { setIsEditingGoal(false); setGoalError(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }} title="Cancel">❌</button>
              </form>
            ) : (
              <>
                <span> / {goal} ml</span>
                <button 
                  onClick={() => { setIsEditingGoal(true); setEditGoalValue(goal.toString()); }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    marginLeft: "8px",
                    padding: "2px 4px",
                    opacity: 0.7
                  }}
                  title="Edit Goal"
                >
                  ✏️
                </button>
              </>
            )}
          </span>
          <span className="water-percentage">{progress}%</span>
        </div>
        {goalError && <div style={{ color: "#f44336", fontSize: "12px", marginTop: "2px", textAlign: "left" }}>{goalError}</div>}

        {/* Progress Bar */}
        <div className="water-progress-bar-bg">
          <div 
            className="water-progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="water-remaining-info">
          Remaining: <strong>{remaining} ml</strong>
        </div>
      </div>

      <div className="water-quick-actions">
        <span className="quick-add-label">Quick Add:</span>
        <div className="quick-add-buttons">
          <button 
            disabled={adding}
            onClick={() => handleQuickAdd(250)}
            className="quick-add-btn"
          >
            +250 ml
          </button>
          <button 
            disabled={adding}
            onClick={() => handleQuickAdd(500)}
            className="quick-add-btn"
          >
            +500 ml
          </button>
          <button 
            disabled={adding}
            onClick={() => handleQuickAdd(750)}
            className="quick-add-btn"
          >
            +750 ml
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterCard;
