import "./MealSection.css";

const MealSection = ({ title, emoji, meals = [] }) => {
  // Total calories for this meal section
  const totalCalories = meals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  return (
    <div className="meal-card">
      <div className="meal-header">
        <h3>
          {emoji} {title}
        </h3>

        <span>{totalCalories} kcal</span>
      </div>

      {meals.length === 0 ? (
        <div className="empty-meal">
          <p>No meals added today.</p>

          <button>Add Food</button>
        </div>
      ) : (
        <div className="meal-list">
          {meals.map((meal) => (
            <div className="meal-item" key={meal._id}>
              <div>
                <h4>{meal.food.name}</h4>

                <p>
                  {meal.food ? (
                    <>
                      {(meal.food.unitType === "gram" || meal.food.unitType === "volume") && (
                        `Weight: ${meal.grams || meal.quantity * 100} ${meal.food.unitType === "volume" ? "ml" : "g"}`
                      )}
                      {meal.food.unitType === "piece" && (
                        `Quantity: ${meal.quantity}${meal.size ? ` (${meal.size})` : ""}`
                      )}
                      {meal.food.unitType === "serving" && (
                        `Quantity: ${meal.quantity}${meal.serving ? ` (${meal.serving})` : ""}`
                      )}
                    </>
                  ) : (
                    `Quantity: ${meal.quantity}`
                  )}
                </p>
              </div>

              <strong>{meal.calories} kcal</strong>
            </div>
          ))}

          <button className="add-food-btn">
            + Add Food
          </button>
        </div>
      )}
    </div>
  );
};

export default MealSection;