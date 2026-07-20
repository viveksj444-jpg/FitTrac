import { useState } from "react";
import "./NetCaloriesCharts.css";

const NetCaloriesCharts = ({
  netCalories = 1430,
  consumed = 1850,
  burned = 420,
  goal = 2500,
}) => {
  const [activeTab, setActiveTab] = useState("weekly");

  // Sample weekly data anchored to current values for today (Thu/Fri)
  const daysData = [
    { day: "Mon", consumed: 2100, burned: 350, net: 1750 },
    { day: "Tue", consumed: 2300, burned: 500, net: 1800 },
    { day: "Wed", consumed: 1950, burned: 400, net: 1550 },
    { day: "Thu", consumed: Math.round(consumed) || 1850, burned: Math.round(burned) || 420, net: Math.round(netCalories) || 1430 },
    { day: "Fri", consumed: 2200, burned: 450, net: 1750 },
    { day: "Sat", consumed: 2400, burned: 600, net: 1800 },
    { day: "Sun", consumed: 2000, burned: 300, net: 1700 },
  ];

  const maxCalorieValue = Math.max(
    goal,
    ...daysData.map((d) => Math.max(d.consumed, d.net))
  ) * 1.15;

  return (
    <div className="net-charts-container">
      <div className="charts-header">
        <div className="header-titles">
          <h3>📊 Net Calorie Analytics</h3>
          <p className="subtitle">Weekly trends and intake vs burn breakdown</p>
        </div>
        <div className="chart-tabs">
          <button
            className={`tab-btn ${activeTab === "weekly" ? "active" : ""}`}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly Net Calories
          </button>
          <button
            className={`tab-btn ${activeTab === "trend" ? "active" : ""}`}
            onClick={() => setActiveTab("trend")}
          >
            Daily Trend
          </button>
          <button
            className={`tab-btn ${activeTab === "comparison" ? "active" : ""}`}
            onClick={() => setActiveTab("comparison")}
          >
            Burned vs Consumed
          </button>
        </div>
      </div>

      <div className="chart-content">
        {activeTab === "weekly" && (
          <div className="chart-wrapper weekly-chart">
            <div className="goal-line-indicator" style={{ bottom: `${(goal / maxCalorieValue) * 100}%` }}>
              <span className="goal-tag">Goal: {goal} kcal</span>
            </div>
            <div className="bars-grid">
              {daysData.map((item, idx) => {
                const heightPct = (item.net / maxCalorieValue) * 100;
                const isOverGoal = item.net > goal;
                return (
                  <div key={idx} className="bar-column">
                    <div className="bar-val">{item.net}</div>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${isOverGoal ? "over-goal" : ""}`}
                        style={{ height: `${Math.min(100, Math.max(5, heightPct))}%` }}
                      />
                    </div>
                    <span className="bar-label">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "trend" && (
          <div className="chart-wrapper trend-chart">
            <div className="horizontal-bars">
              {daysData.map((item, idx) => {
                const widthPct = (item.net / maxCalorieValue) * 100;
                return (
                  <div key={idx} className="h-bar-row">
                    <span className="h-day-label">{item.day}</span>
                    <div className="h-bar-track">
                      <div
                        className="h-bar-fill"
                        style={{ width: `${Math.min(100, Math.max(5, widthPct))}%` }}
                      >
                        <span className="h-bar-val">{item.net} kcal</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="chart-wrapper comparison-chart">
            <div className="comparison-legend">
              <span className="legend-item consumed"><span className="dot" /> Consumed</span>
              <span className="legend-item burned"><span className="dot" /> Burned</span>
            </div>
            <div className="dual-bars-grid">
              {daysData.map((item, idx) => {
                const consumedPct = (item.consumed / maxCalorieValue) * 100;
                const burnedPct = (item.burned / maxCalorieValue) * 100;
                return (
                  <div key={idx} className="dual-bar-column">
                    <div className="dual-bar-group">
                      <div
                        className="dual-fill consumed-fill"
                        style={{ height: `${Math.min(100, Math.max(5, consumedPct))}%` }}
                        title={`Consumed: ${item.consumed} kcal`}
                      />
                      <div
                        className="dual-fill burned-fill"
                        style={{ height: `${Math.min(100, Math.max(5, burnedPct))}%` }}
                        title={`Burned: ${item.burned} kcal`}
                      />
                    </div>
                    <span className="bar-label">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetCaloriesCharts;
