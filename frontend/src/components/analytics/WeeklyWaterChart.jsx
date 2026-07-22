import React from "react";

const WeeklyWaterChart = ({ dailyData = [] }) => {
  if (!dailyData || dailyData.length === 0) {
    return <div className="no-chart-data">No data available for water tracking.</div>;
  }

  // Find max value to scale the chart
  const maxWater = Math.max(
    3000, // Target goal reference level
    ...dailyData.map((d) => d.water || 0)
  ) * 1.15; // 15% padding for the top

  const targetLineY = 3000; // default water target
  const targetPct = (targetLineY / maxWater) * 100;

  return (
    <div className="analytics-chart-card water-chart">
      <div className="chart-card-header">
        <div>
          <h3>💧 Water Intake</h3>
          <p className="subtitle">Daily water consumption compared to target</p>
        </div>
        <div className="water-target-label">
          Target: 3,000 ml
        </div>
      </div>

      <div className="water-chart-container" style={{ position: "relative" }}>
        {/* Target Guideline */}
        <div
          className="water-target-line"
          style={{ bottom: `${targetPct}%` }}
        >
          <span className="target-tag">Target: 3000ml</span>
        </div>

        <div className="water-bars-grid">
          {dailyData.map((dayItem, idx) => {
            const heightPct = ((dayItem.water || 0) / maxWater) * 100;
            const metGoal = dayItem.water >= 3000;

            return (
              <div key={idx} className="water-bar-column">
                <span className="water-val">{dayItem.water} <small>ml</small></span>
                <div className="water-track">
                  <div
                    className={`water-fill ${metGoal ? "goal-met" : "goal-missed"}`}
                    style={{ height: `${Math.max(5, heightPct)}%` }}
                  />
                </div>
                <span className="water-day-label">{dayItem.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyWaterChart;
