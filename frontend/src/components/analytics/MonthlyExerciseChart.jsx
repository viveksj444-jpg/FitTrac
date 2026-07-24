import React, { useState } from "react";

const MonthlyExerciseChart = ({ dailyData = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!dailyData || dailyData.length === 0) {
    return <div className="no-chart-data">No data available for exercise tracking.</div>;
  }

  // 1. Chart sizing
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 30, right: 20, bottom: 40, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Find max value to scale the chart
  const maxBurned = Math.max(
    300, // minimum scale reference (300 kcal)
    ...dailyData.map((d) => d.burned || 0)
  ) * 1.15; // 15% padding for the top

  const getY = (val) => {
    const ratio = val / maxBurned;
    return padding.top + graphHeight - ratio * graphHeight;
  };

  const getX = (idx) => {
    const step = graphWidth / dailyData.length;
    return padding.left + idx * step + step / 2;
  };

  const barWidth = Math.max(4, (graphWidth / dailyData.length) * 0.7);

  // Generate gridline levels (4 levels)
  const gridLevels = 4;
  const gridLines = [];
  for (let i = 0; i < gridLevels; i++) {
    gridLines.push((i / (gridLevels - 1)) * maxBurned);
  }

  return (
    <div className="analytics-chart-card exercise-chart-card">
      <div className="chart-card-header">
        <div>
          <h3>🏋 30-Day Exercise Activity</h3>
          <p className="subtitle">Daily calories burned through workouts</p>
        </div>
      </div>

      <div className="chart-svg-container" style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-bar-chart">
          {/* Gridlines */}
          {gridLines.map((val, idx) => (
            <g key={idx}>
              <line
                className="chart-gridline"
                x1={padding.left}
                y1={getY(val)}
                x2={svgWidth - padding.right}
                y2={getY(val)}
              />
              <text
                className="chart-axis-label y-axis-label"
                x={padding.left - 8}
                y={getY(val) + 3}
                textAnchor="end"
              >
                {Math.round(val)} kcal
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {dailyData.map((d, idx) => {
            if (idx % 5 !== 0 && idx !== dailyData.length - 1) return null;
            const dateParts = d.date.split("-");
            const labelStr = `${dateParts[1]}/${dateParts[2]}`;

            return (
              <text
                key={idx}
                className="chart-axis-label x-axis-label"
                x={getX(idx)}
                y={svgHeight - 15}
                textAnchor="middle"
              >
                {labelStr}
              </text>
            );
          })}

          {/* Bars */}
          {dailyData.map((d, idx) => {
            const x = getX(idx);
            const y = getY(d.burned || 0);
            const height = Math.max(1, padding.top + graphHeight - y);
            const active = (d.burned || 0) > 0;

            return (
              <g key={idx}>
                {/* Visual Bar */}
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx="1.5"
                  fill={active ? "#ea580c" : "#e2e8f0"}
                  opacity={hoveredIdx === idx ? 1.0 : 0.8}
                  style={{ transition: "opacity 0.2s" }}
                />

                {/* Hotspot for hover */}
                <rect
                  x={x - graphWidth / (dailyData.length * 2)}
                  y={padding.top}
                  width={graphWidth / dailyData.length}
                  height={graphHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "pointer" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="chart-tooltip"
            style={{
              position: "absolute",
              left: `${getX(hoveredIdx) + 12}px`,
              top: `${getY(dailyData[hoveredIdx].burned || 0) - 20}px`,
              transform: getX(hoveredIdx) > svgWidth / 2 ? "translateX(-110%)" : "none",
              borderColor: "#ea580c",
              zIndex: 10,
            }}
          >
            <div className="tooltip-day">{dailyData[hoveredIdx].date}</div>
            <div className="tooltip-value">
              Burned: <strong>{dailyData[hoveredIdx].burned || 0} kcal</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyExerciseChart;
