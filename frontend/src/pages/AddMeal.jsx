import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getFoods } from "../services/foodService";
import { addMeal } from "../services/mealService";
import "./AddMeal.css";

const AddMeal = () => {
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [foodsList, setFoodsList] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Selected food state
  const [selectedFood, setSelectedFood] = useState(null);

  // Form states
  const [mealType, setMealType] = useState("breakfast");
  const [servingSize, setServingSize] = useState("medium"); // small, medium, large (for piece)
  const [selectedServingName, setSelectedServingName] = useState(""); // for serving type
  const [grams, setGrams] = useState(100); // for gram/volume type
  const [quantity, setQuantity] = useState(1);

  // Submit status
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch foods on mount / when searchQuery changes
  useEffect(() => {
    const fetchFoods = async () => {
      setSearchLoading(true);
      setSearchError("");
      try {
        const data = await getFoods(searchQuery);
        if (data && data.success) {
          setFoodsList(data.foods);
        } else {
          setFoodsList([]);
        }
      } catch (err) {
        console.error(err);
        setSearchError("Failed to fetch food list.");
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce search slightly to avoid hitting API on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchFoods();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Set defaults when selected food changes
  useEffect(() => {
    if (selectedFood) {
      setQuantity(1);
      if (selectedFood.unitType === "piece") {
        setServingSize("medium");
      } else if (selectedFood.unitType === "serving" && selectedFood.servings?.length > 0) {
        setSelectedServingName(selectedFood.servings[0].name);
      } else if (selectedFood.unitType === "gram" || selectedFood.unitType === "volume") {
        setGrams(100);
      }
    }
  }, [selectedFood]);

  // Helper for matching food emoji
  const getFoodEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes("banana")) return "🍌";
    if (n.includes("egg")) return "🥚";
    if (n.includes("chicken")) return "🍗";
    if (n.includes("milk")) return "🥛";
    if (n.includes("rice")) return "🍚";
    if (n.includes("soya") || n.includes("soy")) return "🌱";
    if (n.includes("peanut") || n.includes("nut")) return "🥜";
    if (n.includes("dal") || n.includes("lentil") || n.includes("soup")) return "🍲";
    if (n.includes("fish")) return "🐟";
    if (n.includes("apple")) return "🍎";
    if (n.includes("salad")) return "🥗";
    if (n.includes("bread")) return "🍞";
    if (n.includes("oat")) return "🥣";
    return "🍽";
  };

  // Live preview calculation matching backend math
  const calculatePreview = () => {
    if (!selectedFood) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    const unit = selectedFood.unitType;

    if (unit === "piece") {
      const sizeData = selectedFood.sizes[servingSize];
      if (sizeData) {
        calories = sizeData.calories * quantity;
        protein = sizeData.protein * quantity;
        carbs = sizeData.carbs * quantity;
        fat = sizeData.fat * quantity;
      }
    } else if (unit === "gram" || unit === "volume") {
      const nut = selectedFood.nutritionPer100;
      if (nut) {
        calories = (nut.calories * grams) / 100;
        protein = (nut.protein * grams) / 100;
        carbs = (nut.carbs * grams) / 100;
        fat = (nut.fat * grams) / 100;
      }
    } else if (unit === "serving" && selectedFood.servings) {
      const srvData = selectedFood.servings.find(
        (s) => s.name.toLowerCase() === selectedServingName.toLowerCase()
      );
      if (srvData) {
        calories = srvData.calories * quantity;
        protein = srvData.protein * quantity;
        carbs = srvData.carbs * quantity;
        fat = srvData.fat * quantity;
      }
    }

    // Format numbers nicely
    return {
      calories: Math.round(calories * 10) / 10,
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };
  };

  const preview = calculatePreview();

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFood) {
      setSubmitError("Please select a food item first.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const mealPayload = {
        foodId: selectedFood._id,
        mealType,
        quantity,
      };

      if (selectedFood.unitType === "piece") {
        mealPayload.size = servingSize;
      } else if (selectedFood.unitType === "serving") {
        mealPayload.serving = selectedServingName;
      } else if (selectedFood.unitType === "gram" || selectedFood.unitType === "volume") {
        mealPayload.grams = grams;
        mealPayload.quantity = 1; // set fixed quantity for grams/volume unit types
      }

      await addMeal(mealPayload);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || "Failed to log meal. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="add-meal-container">
        <div className="add-meal-card">
          <div className="card-header">
            <span className="back-btn" onClick={() => navigate("/dashboard")} title="Back to Dashboard">
              ←
            </span>
            <h1 className="title">🍽 Add Meal</h1>
          </div>

          {submitSuccess && (
            <div className="alert success-alert">
              🎉 Meal logged successfully! Redirecting...
            </div>
          )}

          {submitError && (
            <div className="alert error-alert">
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="meal-form">
            {/* Search Section */}
            <div className="form-group search-group">
              <label htmlFor="food-search" className="section-label">
                🔍 Search Food
              </label>
              <input
                id="food-search"
                type="text"
                className="search-input"
                placeholder="Type to search (e.g., Banana, Egg, Rice...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchLoading && <p className="search-status">Searching foods...</p>}
              {searchError && <p className="search-status error-text">{searchError}</p>}

              <div className="results-container">
                <span className="results-header">Results</span>
                <div className="results-list">
                  {foodsList.length > 0 ? (
                    foodsList.map((food) => (
                      <div
                        key={food._id}
                        className={`food-item ${selectedFood?._id === food._id ? "selected" : ""}`}
                        onClick={() => setSelectedFood(food)}
                      >
                        <span className="food-emoji">{getFoodEmoji(food.name)}</span>
                        <div className="food-info">
                          <span className="food-name">{food.name}</span>
                          <span className="food-category">{food.category}</span>
                        </div>
                        {selectedFood?._id === food._id && <span className="check-icon">✓</span>}
                      </div>
                    ))
                  ) : (
                    !searchLoading && <p className="no-results">No matching foods found. Try another search.</p>
                  )}
                </div>
              </div>
            </div>

            {selectedFood && (
              <div className="food-customization animate-fade-in">
                <hr className="divider" />

                {/* Meal Type */}
                <div className="form-group">
                  <label htmlFor="meal-type" className="input-label">Meal Type</label>
                  <select
                    id="meal-type"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="form-select"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                {/* Serving details based on unitType */}
                {selectedFood.unitType === "piece" && (
                  <div className="form-group">
                    <label htmlFor="serving-size" className="input-label">Serving Size</label>
                    <select
                      id="serving-size"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      className="form-select"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                )}

                {selectedFood.unitType === "serving" && selectedFood.servings?.length > 0 && (
                  <div className="form-group">
                    <label htmlFor="serving-select" className="input-label">Serving Option</label>
                    <select
                      id="serving-select"
                      value={selectedServingName}
                      onChange={(e) => setSelectedServingName(e.target.value)}
                      className="form-select"
                    >
                      {selectedFood.servings.map((srv) => (
                        <option key={srv.name} value={srv.name}>
                          {srv.name} {srv.capacity ? `(${srv.capacity})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedFood.unitType === "gram" || selectedFood.unitType === "volume") && (
                  <div className="form-group">
                    <label htmlFor="grams-input" className="input-label">
                      {selectedFood.unitType === "volume" ? "Volume (ml)" : "Weight (grams)"}
                    </label>
                    <input
                      id="grams-input"
                      type="number"
                      min="1"
                      className="form-input"
                      value={grams}
                      onChange={(e) => setGrams(Math.max(1, parseInt(e.target.value) || 0))}
                      onFocus={(e) => e.target.select()}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                )}

                {/* Quantity - Hide for grams/volume since grams is the precise intake value */}
                {selectedFood.unitType !== "gram" && selectedFood.unitType !== "volume" && (
                  <div className="form-group quantity-group">
                    <label className="input-label">Quantity</label>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="qty-btn"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <hr className="divider" />

                {/* Preview Cards */}
                <div className="preview-container">
                  <span className="preview-title">Calories Preview</span>
                  <div className="calories-value">{preview.calories} kcal</div>

                  <div className="macros-grid">
                    <div className="macro-item protein">
                      <span className="macro-label">Protein</span>
                      <span className="macro-val">{preview.protein} g</span>
                    </div>
                    <div className="macro-item carbs">
                      <span className="macro-label">Carbs</span>
                      <span className="macro-val">{preview.carbs} g</span>
                    </div>
                    <div className="macro-item fat">
                      <span className="macro-label">Fat</span>
                      <span className="macro-val">{preview.fat} g</span>
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Adding Meal..." : "Add Meal"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMeal;