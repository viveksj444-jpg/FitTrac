import React, { useState } from "react";

const MonthlyCaloriesChart = ({ dailyData = [] }) => {
  const [activeLines, setActiveLines] = useState({
    consumed: true,
    burned: true,
    net: true,
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!dailyData || dailyData.length === 0) {
    return <div className="no-chart-data">No data available for charts.</div>;
  }

  // Dimensions of SVG viewBox
  const svgWidth = 600;
  const svgHeight = 320;
  const padding = { top: 30, right: 25, bottom: 45, left: 55 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Find max and min values to scale the Y axis
  const allValues = dailyData.flatMap((d) => [d.consumed || 0, d.burned || 0, d.net || 0]);
  const rawMax = Math.max(...allValues, 1000); // at least 1000 scale
  const rawMin = Math.min(...allValues, 0); // handle negative net calories

  const maxY = Math.ceil(rawMax * 1.15); // Add 15% padding
  const minY = Math.floor(rawMin * 1.1); // Add negative padding if below zero

  // Map value to SVG Y coordinate
  const getY = (val) => {
    const ratio = (val - minY) / (maxY - minY);
    return padding.top + graphHeight - ratio * graphHeight;
  };

  // Map index to SVG X coordinate
  const getX = (idx) => {
    if (dailyData.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (idx / (dailyData.length - 1)) * graphWidth;
  };

  // Generate path commands
  const getPathData = (field) => {
    return dailyData
      .map((d, idx) => {
        const x = getX(idx);
        const y = getY(d[field] || 0);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  // Generate closed path for area gradient fill
  const getAreaPathData = (field) => {
    const linePath = getPathData(field);
    if (!linePath) return "";
    const startX = getX(0);
    const endX = getX(dailyData.length - 1);
    const baselineY = getY(0); // Fill down to the 0 line
    return `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
  };

  // Generate gridline values (5 levels)
  const gridLevels = 5;
  const gridLines = [];
  for (let i = 0; i < gridLevels; i++) {
    const val = minY + (i / (gridLevels - 1)) * (maxY - minY);
    gridLines.push(val);
  }

  const toggleLine = (line) => {
    setActiveLines((prev) => ({
      ...prev,
      [line]: !prev[line],
    }));
  };

  return (
    <div className="analytics-chart-card monthly-calories-chart">
      <div className="chart-card-header">
        <div>
          <h3>📈 30-Day Calories Trend</h3>
          <p className="subtitle">Daily consumed, burned, and net calories</p>
        </div>
        <div className="chart-legend">
          <button
            className={`legend-btn consumed ${activeLines.consumed ? "active" : "inactive"}`}
            onClick={() => toggleLine("consumed")}
          >
            <span className="legend-dot bg-consumed" /> Consumed
          </button>
          <button
            className={`legend-btn burned ${activeLines.burned ? "active" : "inactive"}`}
            onClick={() => toggleLine("burned")}
          >
            <span className="legend-dot bg-burned" /> Burned
          </button>
          <button
            className={`legend-btn net ${activeLines.net ? "active" : "inactive"}`}
            onClick={() => toggleLine("net")}
          >
            <span className="legend-dot bg-net" /> Net Calories
          </button>
        </div>
      </div>

      <div className="chart-svg-container" style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-line-chart">
          <defs>
            <linearGradient id="m-gradient-consumed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="m-gradient-burned" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="m-gradient-net" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

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
                x={padding.left - 10}
                y={getY(val) + 4}
                textAnchor="end"
              >
                {Math.round(val)}
              </text>
            </g>
          ))}

          {/* X Axis Labels - rendering every 5 days + last day to fit 30 days */}
          {dailyData.map((d, idx) => {
            const isLabelVisible = idx % 5 === 0 || idx === dailyData.length - 1;
            if (!isLabelVisible) return null;

            const dateParts = d.date.split("-");
            const labelStr = `${dateParts[1]}/${dateParts[2]}`; // MM/DD

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

          {/* Areas */}
          {activeLines.consumed && (
            <path d={getAreaPathData("consumed")} fill="url(#m-gradient-consumed)" />
          )}
          {activeLines.burned && (
            <path d={getAreaPathData("burned")} fill="url(#m-gradient-burned)" />
          )}
          {activeLines.net && (
            <path d={getAreaPathData("net")} fill="url(#m-gradient-net)" />
          )}

          {/* Lines */}
          {activeLines.consumed && (
            <path
              className="chart-line line-consumed"
              d={getPathData("consumed")}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {activeLines.burned && (
            <path
              className="chart-line line-burned"
              d={getPathData("burned")}
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {activeLines.net && (
            <path
              className="chart-line line-net"
              d={getPathData("net")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Interactivity columns overlay */}
          {dailyData.map((d, idx) => {
            const x = getX(idx);
            return (
              <rect
                key={idx}
                x={x - graphWidth / (dailyData.length * 2)}
                y={padding.top}
                width={graphWidth / dailyData.length}
                height={graphHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {/* Hover Line */}
          {hoveredIndex !== null && (
            <line
              className="chart-hover-line"
              x1={getX(hoveredIndex)}
              y1={padding.top}
              x2={getX(hoveredIndex)}
              y2={padding.top + graphHeight}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Hover Dots */}
          {hoveredIndex !== null &&
            Object.entries(activeLines).map(([field, active]) => {
              if (!active) return null;
              const colorMap = {
                consumed: "#10b981",
                burned: "#ea580c",
                net: "#3b82f6",
              };
              return (
                <circle
                  key={field}
                  cx={getX(hoveredIndex)}
                  cy={getY(dailyData[hoveredIndex][field] || 0)}
                  r="5"
                  fill={colorMap[field]}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="chart-tooltip"
            style={{
              position: "absolute",
              left: `${getX(hoveredIndex) + 12}px`,
              top: `${getY(dailyData[hoveredIndex].consumed || 0) - 20}px`,
              transform: getX(hoveredIndex) > svgWidth / 2 ? "translateX(-110%)" : "none",
              zIndex: 10,
            }}
          >
            <div className="tooltip-day">{dailyData[hoveredIndex].date}</div>
            <div className="tooltip-grid">
              {activeLines.consumed && (
                <div className="tooltip-item consumed">
                  <span>Consumed:</span> <strong>{dailyData[hoveredIndex].consumed || 0} kcal</strong>
                </div>
              )}
              {activeLines.burned && (
                <div className="tooltip-item burned">
                  <span>Burned:</span> <strong>{dailyData[hoveredIndex].burned || 0} kcal</strong>
                </div>
              )}
              {activeLines.net && (
                <div className="tooltip-item net">
                  <span>Net:</span> <strong>{dailyData[hoveredIndex].net || 0} kcal</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCaloriesChart;
