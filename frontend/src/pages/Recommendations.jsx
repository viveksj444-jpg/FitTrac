import React from "react";
import Navbar from "../components/Navbar";
import NutritionSummary from "../components/recommendations/NutritionSummary";
import RecommendationCard from "../components/recommendations/RecommendationCard";
import useRecommendations from "../hooks/useRecommendations";
import "./Recommendations.css";

const Recommendations = () => {
  const { summary, recommendations, loading, error, refetch } = useRecommendations();

  if (loading) {
    return (
      <div className="recommendations-page-wrapper">
        <Navbar />
        <div className="recommendations-container loading-state">
          <div className="spinner"></div>
          <h2>🧠 Analyzing your nutrition data...</h2>
          <p>Generating personalized food & hydration recommendations</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page-wrapper">
        <Navbar />
        <div className="recommendations-container error-state">
          <h2>⚠️ Something went wrong</h2>
          <p>{error}</p>
          <button onClick={refetch} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page-wrapper">
      <Navbar />

      <main className="recommendations-container">
        {/* Top Header */}
        <header className="recommendations-header">
          <div className="header-badge">
            <span className="header-badge-icon">🤖</span> AI Nutrition Engine
          </div>
          <h1>Smart Nutrition Recommendations</h1>
          <p>
            Real-time personalized advice based on today's meals, hydration, and your fitness goal.
          </p>
        </header>

        {/* Summary Cards */}
        {summary && <NutritionSummary summary={summary} />}

        {/* Recommendations Section */}
        <section className="recommendations-content">
          <div className="section-title-wrapper">
            <h2>💡 Personalized Action Plan</h2>
            <span className="rec-count">{recommendations.length} Suggestions</span>
          </div>

          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        </section>

        {/* Extra Features: Quick Reference Guides */}
        <section className="extra-guides-section">
          <h3>🌟 Nutrition Reference & Guidelines</h3>
          <div className="extra-guides-grid">
            <div className="guide-card protein-guide">
              <div className="guide-header">
                <span className="guide-icon">🍗</span>
                <h4>High Protein Foods</h4>
              </div>
              <p>Opt for lean meats, paneer, eggs, greek yogurt, fish, soya, and legumes to boost recovery.</p>
            </div>

            <div className="guide-card water-guide">
              <div className="guide-header">
                <span className="guide-icon">💧</span>
                <h4>Hydration Tips</h4>
              </div>
              <p>Aim for 3000ml+ water daily. Sip regularly throughout the day rather than drinking large amounts at once.</p>
            </div>

            <div className="guide-card fat-guide">
              <div className="guide-header">
                <span className="guide-icon">🥑</span>
                <h4>Healthy Fat Tips</h4>
              </div>
              <p>Prefer unsaturated fats from almonds, walnuts, seeds, avocado, and olive oil over fried saturated fats.</p>
            </div>

            <div className="guide-card carb-guide">
              <div className="guide-header">
                <span className="guide-icon">🌾</span>
                <h4>Healthy Carb Tips</h4>
              </div>
              <p>Choose unrefined whole grains like oats, sweet potatoes, brown rice, and quinoa for sustained energy.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Recommendations;
