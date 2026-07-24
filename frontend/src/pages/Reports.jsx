import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFilePdf, FaBookOpen, FaUndo } from "react-icons/fa";
import DownloadReportButton from "../components/reports/DownloadReportButton";
import "./Reports.css";

const Reports = () => {
  const sections = [
    {
      num: "1",
      title: "Monthly Summary",
      desc: "High-level review of averages for Calories, Burned, Net Calories, Water, and overall goal completion rates.",
      icon: "📊",
    },
    {
      num: "2",
      title: "Nutrition & Macros",
      desc: "Average daily protein, carbohydrates, and fats intake, as well as macro distribution percentage splits.",
      icon: "🥗",
    },
    {
      num: "3",
      title: "Exercise & Activity",
      desc: "Detailed metrics on total logged workouts, total calorie burn, and your most active days.",
      icon: "🏋",
    },
    {
      num: "4",
      title: "Hydration Status",
      desc: "Complete assessment of water consumption, best hydration days, and fluid totals.",
      icon: "💧",
    },
    {
      num: "5",
      title: "Personalized Insights",
      desc: "Algorithmic observations comparing weekly behaviors and detecting key dietary habits.",
      icon: "💡",
    },
    {
      num: "6",
      title: "Milestone Streaks",
      desc: "Highlighting habit streaks like healthy streaks, hydration streaks, and exercise streaks.",
      icon: "🏆",
    },
  ];

  return (
    <div className="reports-page">
      {/* Background decoration */}
      <div className="bg-glow bg-glow-reports-1"></div>
      <div className="bg-glow bg-glow-reports-2"></div>

      <header className="reports-header">
        <Link to="/dashboard" className="back-btn">
          <FaArrowLeft /> Dashboard
        </Link>
        <h1>📄 Health Reports</h1>
        <p className="subtitle">Export a professional PDF summary of your health metrics and logs</p>
      </header>

      <div className="reports-content-grid">
        {/* Left Side: Call to Action Card */}
        <div className="report-cta-card">
          <div className="pdf-preview-box">
            <FaFilePdf className="large-pdf-icon" />
            <div className="document-sheet"></div>
          </div>
          <h2>FitTrac Monthly Health Report</h2>
          <p>
            Generate and download a comprehensive 30-day health report. Perfect for sharing with nutritionists, personal trainers, or keeping for your own tracking.
          </p>

          <div className="download-wrapper">
            <DownloadReportButton />
          </div>

          <div className="info-notes">
            <p><strong>Note:</strong> The report contains dynamic calculations based on your live user profile, meal logs, water logs, and exercises logged in the last 30 days.</p>
          </div>
        </div>

        {/* Right Side: Report Section Details */}
        <div className="report-details-section">
          <h3>📂 What's Included in the Report?</h3>
          <p className="section-intro">This professional PDF consists of 6 core sections built using your metrics:</p>
          
          <div className="report-sections-list">
            {sections.map((sec, idx) => (
              <div key={idx} className="report-section-card">
                <div className="section-card-num">{sec.icon}</div>
                <div className="section-card-content">
                  <h4>Section {sec.num}: {sec.title}</h4>
                  <p>{sec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
