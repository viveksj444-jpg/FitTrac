import React from "react";

const WeeklyMacrosChart = ({ dailyData = [] }) => {
  if (!dailyData || dailyData.length === 0) {
    return <div className="no-chart-data">No data available for macro analysis.</div>;
  }

  // Find the maximum macro value (in grams) to scale the heights
  const maxMacro = Math.max(
    80, // Default minimum scale
    ...dailyData.map((d) => Math.max(d.protein || 0, d.carbs || 0, d.fat || 0))
  );

  return (
    <div className="analytics-chart-card macros-chart">
      <div className="chart-card-header">
        <div>
          <h3>🥗 Macronutrient Distribution</h3>
          <p className="subtitle">Daily intake comparison of Protein, Carbs, and Fats</p>
        </div>
        <div className="macro-legend">
          <span className="legend-item protein"><span className="legend-dot bg-protein" /> Protein</span>
          <span className="legend-item carbs"><span className="legend-dot bg-carbs" /> Carbs</span>
          <span className="legend-item fat"><span className="legend-dot bg-fat" /> Fat</span>
        </div>
      </div>

      <div className="macros-bars-container">
        {dailyData.map((dayItem, idx) => {
          const proteinHeight = ((dayItem.protein || 0) / maxMacro) * 100;
          const carbsHeight = ((dayItem.carbs || 0) / maxMacro) * 100;
          const fatHeight = ((dayItem.fat || 0) / maxMacro) * 100;

          return (
            <div key={idx} className="macro-day-column">
              <div className="macro-bar-group">
                {/* Protein Bar */}
                <div className="macro-track">
                  <div
                    className="macro-fill bg-protein"
                    style={{ height: `${Math.max(4, proteinHeight)}%` }}
                    title={`Protein: ${dayItem.protein}g`}
                  >
                    {dayItem.protein > 15 && <span className="macro-val">{dayItem.protein}g</span>}
                  </div>
                </div>

                {/* Carbs Bar */}
                <div className="macro-track">
                  <div
                    className="macro-fill bg-carbs"
                    style={{ height: `${Math.max(4, carbsHeight)}%` }}
                    title={`Carbohydrates: ${dayItem.carbs}g`}
                  >
                    {dayItem.carbs > 15 && <span className="macro-val">{dayItem.carbs}g</span>}
                  </div>
                </div>

                {/* Fat Bar */}
                <div className="macro-track">
                  <div
                    className="macro-fill bg-fat"
                    style={{ height: `${Math.max(4, fatHeight)}%` }}
                    title={`Fat: ${dayItem.fat}g`}
                  >
                    {dayItem.fat > 15 && <span className="macro-val">{dayItem.fat}g</span>}
                  </div>
                </div>
              </div>
              <span className="macro-day-label">{dayItem.day}</span>
              {/* Tooltip on hover showing exact numbers */}
              <div className="macro-column-tooltip">
                <strong>{dayItem.day} Macros:</strong>
                <div>🍗 Protein: {dayItem.protein}g</div>
                <div>🍞 Carbs: {dayItem.carbs}g</div>
                <div>🥑 Fat: {dayItem.fat}g</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyMacrosChart;
