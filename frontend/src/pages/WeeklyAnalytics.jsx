import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useWeeklyAnalytics from "../hooks/useWeeklyAnalytics";
import WeeklySummaryCard from "../components/analytics/WeeklySummaryCard";
import GoalCompletionCard from "../components/analytics/GoalCompletionCard";
import ActivityCard from "../components/analytics/ActivityCard";
import WeeklyCaloriesChart from "../components/analytics/WeeklyCaloriesChart";
import WeeklyMacrosChart from "../components/analytics/WeeklyMacrosChart";
import WeeklyWaterChart from "../components/analytics/WeeklyWaterChart";
import WeeklyInsights from "../components/analytics/WeeklyInsights";
import "./WeeklyAnalytics.css";

const WeeklyAnalytics = () => {
  const { analytics, loading, error } = useWeeklyAnalytics();

  if (loading) {
    return (
      <div className="analytics-loading-container">
        <div className="analytics-spinner"></div>
        <h2>Analyzing your week...</h2>
        <p>Crunching calories, water logs, and workout metrics.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error-container">
        <h2>⚠️ Analysis Failed</h2>
        <p>{error}</p>
        <Link to="/dashboard" className="back-btn-error">
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { summary, dailyData, insights } = analytics || {};

  return (
    <div className="weekly-analytics-page">
      {/* 1. Header with navigation */}
      <header className="analytics-header">
        <div className="header-left">
          <Link to="/dashboard" className="back-btn">
            <FaArrowLeft /> Dashboard
          </Link>
          <h1>📊 Weekly Analytics</h1>
          <p className="subtitle">Detailed performance metrics, charts, and habits over the last 7 days</p>
        </div>
      </header>

      {/* 2. Top Summary Section */}
      <section className="analytics-summary-section">
        <WeeklySummaryCard summary={summary} />
      </section>

      {/* 3. Core Stats & Insights Column Grid */}
      <section className="analytics-insights-section">
        <div className="insights-grid">
          <GoalCompletionCard completionRate={summary?.goalCompletion} />
          <WeeklyInsights insights={insights} />
          <ActivityCard summary={summary} />
        </div>
      </section>

      {/* 4. Charts Breakdown Section */}
      <section className="analytics-charts-section">
        <div className="charts-main-title">
          <h2>📈 Visual Trends</h2>
          <p>Analyze your progress over time with interactive graphs</p>
        </div>
        <div className="charts-grid-layout">
          <div className="chart-full-width">
            <WeeklyCaloriesChart dailyData={dailyData} />
          </div>
          <div className="charts-split-width">
            <WeeklyMacrosChart dailyData={dailyData} />
            <WeeklyWaterChart dailyData={dailyData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeeklyAnalytics;
