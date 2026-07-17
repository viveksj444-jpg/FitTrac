import { Link } from "react-router-dom";
import "./TodayMeals.css";
import MealSection from "./MealSection";

const TodayMeals = ({ meals }) => {
  return (
    <div className="today-meals">

      <div className="today-meals-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h2>🍽 Today's Meals</h2>
          <p style={{ margin: "4px 0 0 0" }}>Your meals logged for today</p>
        </div>
        <Link to="/add-meal" className="add-meal-link-btn" style={{
          backgroundColor: "var(--primary)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 4px 10px rgba(34, 197, 94, 0.2)",
          transition: "all var(--transition)"
        }}>
          + Add Meal
        </Link>
      </div>

      <div className="meal-sections">

        <MealSection
          title="Breakfast"
          emoji="🍳"
          meals={meals.breakfast}
        />

        <MealSection
          title="Lunch"
          emoji="🍛"
          meals={meals.lunch}
        />

        <MealSection
          title="Dinner"
          emoji="🍽"
          meals={meals.dinner}
        />

        <MealSection
          title="Snacks"
          emoji="🍎"
          meals={meals.snack}
        />

      </div>

    </div>
  );
};

export default TodayMeals;