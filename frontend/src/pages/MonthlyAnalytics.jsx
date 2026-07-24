import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import useMonthlyAnalytics from "../hooks/useMonthlyAnalytics";
import MonthlySummaryCard from "../components/analytics/MonthlySummaryCard";
import MonthlyCaloriesChart from "../components/analytics/MonthlyCaloriesChart";
import MonthlyMacrosChart from "../components/analytics/MonthlyMacrosChart";
import MonthlyWaterChart from "../components/analytics/MonthlyWaterChart";
import MonthlyExerciseChart from "../components/analytics/MonthlyExerciseChart";
import MonthlyInsights from "../components/analytics/MonthlyInsights";
import AchievementCard from "../components/analytics/AchievementCard";
import DownloadReportButton from "../components/reports/DownloadReportButton";
import "./MonthlyAnalytics.css";

const MonthlyAnalytics = () => {
  const { analytics, loading, error } = useMonthlyAnalytics();

  if (loading) {
    return (
      <div className="monthly-analytics-loading">
        <div className="loading-container">
          <div className="pulse-loader"></div>
          <h2>Analyzing your Month...</h2>
          <p>Compiling 30 days of calorie metrics, hydration logs, and workout habits.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="monthly-analytics-error">
        <div className="error-card">
          <h2>⚠️ Analytics Unavailable</h2>
          <p>{error}</p>
          <Link to="/dashboard" className="back-btn-error">
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { summary = {}, dailyData = [], insights = [] } = analytics || {};

  return (
    <div className="monthly-analytics-page">
      {/* Background glow effects for glassmorphic style */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Header section with back navigation and report button */}
      <header className="analytics-header">
        <div className="header-left">
          <Link to="/dashboard" className="back-btn">
            <FaArrowLeft /> Dashboard
          </Link>
          <h1>📅 Monthly Health Analytics</h1>
          <p className="subtitle">
            Deep-dive performance report, trend graphs, and habits over the previous 30 days.
          </p>
        </div>
        <div className="header-right">
          <DownloadReportButton />
        </div>
      </header>

      {/* Summary metric cards */}
      <section className="summary-section">
        <MonthlySummaryCard summary={summary} />
      </section>

      {/* Insights and Streaks grid */}
      <section className="insights-streaks-section">
        <div className="insights-streaks-grid">
          <MonthlyInsights insights={insights} />
          <AchievementCard summary={summary} />
        </div>
      </section>

      {/* Charts Section */}
      <section className="trends-section">
        <div className="section-title-bar">
          <h2>📈 30-Day Health Trends</h2>
          <p>Interactive tracking of your daily caloric balances, hydration goals, and workouts</p>
        </div>

        <div className="charts-main-grid">
          {/* Calorie line chart */}
          <div className="chart-wrapper full-width-chart">
            <MonthlyCaloriesChart dailyData={dailyData} />
          </div>

          {/* Macro breakdown and Protein line chart */}
          <div className="chart-wrapper full-width-chart">
            <MonthlyMacrosChart dailyData={dailyData} summary={summary} />
          </div>

          {/* Water intake bar chart */}
          <div className="chart-wrapper split-chart">
            <MonthlyWaterChart dailyData={dailyData} />
          </div>

          {/* Workout burned bar chart */}
          <div className="chart-wrapper split-chart">
            <MonthlyExerciseChart dailyData={dailyData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonthlyAnalytics;
