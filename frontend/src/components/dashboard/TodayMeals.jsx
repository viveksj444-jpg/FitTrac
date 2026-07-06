import "./TodayMeals.css";
import MealSection from "./MealSection";

const TodayMeals = ({ meals }) => {
  return (
    <div className="today-meals">

      <div className="today-meals-header">
        <h2>🍽 Today's Meals</h2>
        <p>Your meals logged for today</p>
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