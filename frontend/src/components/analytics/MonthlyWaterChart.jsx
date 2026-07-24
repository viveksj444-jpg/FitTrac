import React, { useState } from "react";

const MonthlyWaterChart = ({ dailyData = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!dailyData || dailyData.length === 0) {
    return <div className="no-chart-data">No data available for water tracking.</div>;
  }

  // 1. Chart sizing
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 30, right: 20, bottom: 40, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // 2. Hydration Target
  const targetWater = 3000;

  // Find max value to scale the chart
  const maxWater = Math.max(
    targetWater,
    ...dailyData.map((d) => d.water || 0)
  ) * 1.15; // 15% padding for the top

  const getY = (val) => {
    const ratio = val / maxWater;
    return padding.top + graphHeight - ratio * graphHeight;
  };

  const getX = (idx) => {
    const step = graphWidth / dailyData.length;
    return padding.left + idx * step + step / 2;
  };

  const barWidth = Math.max(4, (graphWidth / dailyData.length) * 0.7);

  // Generate gridline levels
  const gridLevels = 4;
  const gridLines = [];
  for (let i = 0; i < gridLevels; i++) {
    gridLines.push((i / (gridLevels - 1)) * maxWater);
  }

  return (
    <div className="analytics-chart-card water-chart-card">
      <div className="chart-card-header">
        <div>
          <h3>💧 30-Day Water Intake</h3>
          <p className="subtitle">Daily water consumption compared to target</p>
        </div>
        <div className="water-target-label">
          Target: 3,000 ml
        </div>
      </div>

      <div className="chart-svg-container" style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-bar-chart">
          {/* Target Line */}
          <line
            className="chart-target-line"
            x1={padding.left}
            y1={getY(targetWater)}
            x2={svgWidth - padding.right}
            y2={getY(targetWater)}
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text
            x={svgWidth - padding.right}
            y={getY(targetWater) - 4}
            textAnchor="end"
            fill="#0ea5e9"
            fontSize="8"
            fontWeight="bold"
          >
            TARGET: 3000ml
          </text>

          {/* Gridlines */}
          {gridLines.map((val, idx) => {
            // Avoid drawing close to target line to prevent text overlaps
            if (Math.abs(getY(val) - getY(targetWater)) < 12) return null;
            return (
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
                  {Math.round(val)}ml
                </text>
              </g>
            );
          })}

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
            const y = getY(d.water || 0);
            const height = Math.max(2, padding.top + graphHeight - y);
            const metGoal = (d.water || 0) >= targetWater;

            return (
              <g key={idx}>
                {/* Visual Bar */}
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx="2"
                  fill={metGoal ? "#06b6d4" : "#94a3b8"}
                  opacity={hoveredIdx === idx ? 1.0 : 0.75}
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
              top: `${getY(dailyData[hoveredIdx].water || 0) - 20}px`,
              transform: getX(hoveredIdx) > svgWidth / 2 ? "translateX(-110%)" : "none",
              borderColor: "#06b6d4",
              zIndex: 10,
            }}
          >
            <div className="tooltip-day">{dailyData[hoveredIdx].date}</div>
            <div className="tooltip-value">
              Water: <strong>{dailyData[hoveredIdx].water || 0} ml</strong>
              <div className="status" style={{ fontSize: "10px", marginTop: "2px", color: dailyData[hoveredIdx].water >= targetWater ? "#059669" : "#e11d48" }}>
                {dailyData[hoveredIdx].water >= targetWater ? "✓ Target Met" : "✗ Below Target"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyWaterChart;
