import React from "react";
import "./WaterHistory.css";

const WaterHistory = ({ logs = [], onDelete }) => {
  return (
    <div className="water-history-container">
      <h3 className="water-history-title">🕒 Water Intake Logs</h3>
      {logs.length === 0 ? (
        <p className="empty-history">No water logged yet for today.</p>
      ) : (
        <div className="water-logs-list">
          {logs.map((log) => (
            <div key={log._id} className="water-log-item">
              <div className="water-log-info">
                <span className="water-log-icon">💧</span>
                <div className="water-log-text">
                  <span className="water-log-amount">{log.amount} ml</span>
                  <span className="water-log-time">{log.time}</span>
                </div>
              </div>
              <button
                onClick={() => onDelete(log._id)}
                className="delete-log-btn"
                title="Delete log"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaterHistory;
