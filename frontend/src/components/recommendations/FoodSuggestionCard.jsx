import React from "react";
import "./FoodSuggestionCard.css";

const getFoodEmoji = (foodName) => {
  const name = foodName.toLowerCase();
  if (name.includes("chicken")) return "🍗";
  if (name.includes("egg")) return "🥚";
  if (name.includes("paneer")) return "🧀";
  if (name.includes("yogurt")) return "🥛";
  if (name.includes("soya")) return "🫘";
  if (name.includes("fish")) return "🐟";
  if (name.includes("tofu")) return "🧊";
  if (name.includes("whey")) return "🥤";
  if (name.includes("rice")) return "🍚";
  if (name.includes("oat")) return "🥣";
  if (name.includes("potato")) return "🍠";
  if (name.includes("bread")) return "🍞";
  return "🥗";
};

const FoodSuggestionCard = ({ foods = [] }) => {
  if (!foods || foods.length === 0) return null;

  return (
    <div className="food-suggestion-card">
      <h4 className="food-suggestion-title">💡 Recommended Foods:</h4>
      <div className="food-suggestion-grid">
        {foods.map((food, index) => (
          <div key={index} className="food-pill">
            <span className="food-emoji">{getFoodEmoji(food)}</span>
            <span className="food-name">{food}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSuggestionCard;
