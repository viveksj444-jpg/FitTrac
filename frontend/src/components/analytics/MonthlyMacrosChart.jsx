import React, { useState } from "react";

const MonthlyMacrosChart = ({ dailyData = [], summary = {} }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!dailyData || dailyData.length === 0) {
    return <div className="no-chart-data">No data available for macro analysis.</div>;
  }

  // 1. Calculate Average Macro Calorie Split
  const avgP = summary.averageProtein || 0;
  const avgC = summary.averageCarbs || 0;
  const avgF = summary.averageFat || 0;

  const calP = avgP * 4;
  const calC = avgC * 4;
  const calF = avgF * 9;
  const totalCal = calP + calC + calF || 1;

  const pctP = Math.round((calP / totalCal) * 100);
  const pctC = Math.round((calC / totalCal) * 100);
  const pctF = 100 - pctP - pctC; // ensure they add up to 100%

  // 2. Setup 30-day Protein Line Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const proteinValues = dailyData.map((d) => d.protein || 0);
  const maxP = Math.max(...proteinValues, 50) * 1.15; // padding top, min scale 50g

  const getY = (val) => {
    const ratio = val / maxP;
    return padding.top + graphHeight - ratio * graphHeight;
  };

  const getX = (idx) => {
    if (dailyData.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (idx / (dailyData.length - 1)) * graphWidth;
  };

  const getPathData = () => {
    return dailyData
      .map((d, idx) => {
        const x = getX(idx);
        const y = getY(d.protein || 0);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const getAreaPathData = () => {
    const linePath = getPathData();
    if (!linePath) return "";
    const startX = getX(0);
    const endX = getX(dailyData.length - 1);
    const baselineY = getY(0);
    return `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
  };

  // Generate gridline levels (4 levels)
  const gridLevels = 4;
  const gridLines = [];
  for (let i = 0; i < gridLevels; i++) {
    gridLines.push((i / (gridLevels - 1)) * maxP);
  }

  return (
    <div className="analytics-chart-card macros-chart-card">
      <div className="chart-card-header">
        <div>
          <h3>🥗 Monthly Macronutrients & Protein Trend</h3>
          <p className="subtitle">Calorie distribution and daily protein intake</p>
        </div>
      </div>

      {/* Stacked Macro Distribution Progress Bar */}
      <div className="macro-distribution-section">
        <h4 className="section-title">Average Calorie Split</h4>
        <div className="macro-distribution-bar">
          {pctP > 0 && (
            <div
              className="macro-segment protein"
              style={{ width: `${pctP}%` }}
              title={`Protein: ${pctP}% (${avgP}g)`}
            >
              <span>{pctP}%</span>
            </div>
          )}
          {pctC > 0 && (
            <div
              className="macro-segment carbs"
              style={{ width: `${pctC}%` }}
              title={`Carbs: ${pctC}% (${avgC}g)`}
            >
              <span>{pctC}%</span>
            </div>
          )}
          {pctF > 0 && (
            <div
              className="macro-segment fat"
              style={{ width: `${pctF}%` }}
              title={`Fat: ${pctF}% (${avgF}g)`}
            >
              <span>{pctF}%</span>
            </div>
          )}
        </div>

        <div className="macro-distribution-labels">
          <div className="label-item protein">
            <span className="dot" />
            <span>Protein: <strong>{avgP}g</strong> ({pctP}%)</span>
          </div>
          <div className="label-item carbs">
            <span className="dot" />
            <span>Carbohydrates: <strong>{avgC}g</strong> ({pctC}%)</span>
          </div>
          <div className="label-item fat">
            <span className="dot" />
            <span>Fat: <strong>{avgF}g</strong> ({pctF}%)</span>
          </div>
        </div>
      </div>

      <hr className="chart-divider" />

      {/* Protein Trend Chart */}
      <div className="protein-trend-section">
        <h4 className="section-title">🍗 30-Day Protein Intake (grams)</h4>
        <div className="chart-svg-container" style={{ position: "relative" }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="svg-line-chart">
            <defs>
              <linearGradient id="gradient-protein" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
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
                  x={padding.left - 8}
                  y={getY(val) + 3}
                  textAnchor="end"
                >
                  {Math.round(val)}g
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
                  y={svgHeight - 10}
                  textAnchor="middle"
                >
                  {labelStr}
                </text>
              );
            })}

            {/* Area */}
            <path d={getAreaPathData()} fill="url(#gradient-protein)" />

            {/* Line */}
            <path
              className="chart-line line-protein"
              d={getPathData()}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Interaction points */}
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
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "pointer" }}
                />
              );
            })}

            {/* Hover Dot */}
            {hoveredIdx !== null && (
              <circle
                cx={getX(hoveredIdx)}
                cy={getY(dailyData[hoveredIdx].protein || 0)}
                r="4.5"
                fill="#4f46e5"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            )}
          </svg>

          {/* Hover Tooltip */}
          {hoveredIdx !== null && (
            <div
              className="chart-tooltip"
              style={{
                position: "absolute",
                left: `${getX(hoveredIdx) + 12}px`,
                top: `${getY(dailyData[hoveredIdx].protein || 0) - 20}px`,
                transform: getX(hoveredIdx) > svgWidth / 2 ? "translateX(-110%)" : "none",
                borderColor: "#4f46e5",
                zIndex: 10,
              }}
            >
              <div className="tooltip-day">{dailyData[hoveredIdx].date}</div>
              <div className="tooltip-value">
                Protein: <strong>{dailyData[hoveredIdx].protein || 0}g</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyMacrosChart;
