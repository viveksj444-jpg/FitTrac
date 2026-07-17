import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getExerciseTypes, addExercise } from "../services/exerciseService";
import API from "../services/api";
import "./AddExercise.css";

const AddExercise = () => {
  const navigate = useNavigate();

  // Exercise types list
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userWeight, setUserWeight] = useState(70); // fallback default

  // Selected exercise
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isCustom, setIsCustom] = useState(false);

  // Form states
  const [duration, setDuration] = useState(30);
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Cardio");
  const [customCalories, setCustomCalories] = useState(150);

  // Submit states
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch exercise types and user profile on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const types = await getExerciseTypes();
        setExerciseTypes(types);
        
        const token = localStorage.getItem("token");
        const res = await API.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.weight) {
          setUserWeight(res.data.weight);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    initData();
  }, []);

  // Filter exercises
  const filteredTypes = exerciseTypes.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate calories burned preview
  const getCaloriesPreview = () => {
    if (isCustom) {
      return customCalories;
    }
    if (!selectedExercise) return 0;
    // MET formula: Burned = Duration * MET * 3.5 * weight / 200
    return Math.round((duration * selectedExercise.met * 3.5 * userWeight) / 200);
  };

  const caloriesPreview = getCaloriesPreview();

  const handleExerciseSelect = (ex) => {
    setSelectedExercise(ex);
    setIsCustom(false);
    setSubmitError("");
  };

  const handleSelectCustom = () => {
    setSelectedExercise(null);
    setIsCustom(true);
    setSubmitError("");
  };

  const getExerciseEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes("run")) return "🏃";
    if (n.includes("walk")) return "🚶";
    if (n.includes("cycle") || n.includes("bike")) return "🚴";
    if (n.includes("swim")) return "🏊";
    if (n.includes("weight") || n.includes("lift") || n.includes("strength")) return "🏋️";
    if (n.includes("yoga") || n.includes("stretch")) return "🧘";
    if (n.includes("jump") || n.includes("rope")) return "🪢";
    if (n.includes("hiit") || n.includes("cardio")) return "⚡";
    if (n.includes("pilates")) return "🤸";
    return "💪";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExercise && !isCustom) {
      setSubmitError("Please select an exercise or choose custom log.");
      return;
    }

    if (isCustom && !customName.trim()) {
      setSubmitError("Please enter an exercise name for custom logging.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const payload = {
        duration: Number(duration),
      };

      if (isCustom) {
        payload.name = customName;
        payload.category = customCategory;
        payload.caloriesBurned = Number(customCalories);
      } else {
        payload.name = selectedExercise.name;
        payload.category = selectedExercise.category;
        payload.met = selectedExercise.met;
      }

      await addExercise(payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || "Failed to log workout. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="add-exercise-container">
        <div className="add-exercise-card">
          <div className="card-header">
            <span className="back-btn" onClick={() => navigate("/dashboard")} title="Back to Dashboard">
              ←
            </span>
            <h1 className="title">🏃 Add Exercise</h1>
          </div>

          {submitSuccess && (
            <div className="alert success-alert">
              🎉 Exercise logged successfully! Redirecting...
            </div>
          )}

          {submitError && (
            <div className="alert error-alert">
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="exercise-form">
            {/* Search Section */}
            <div className="form-group search-group">
              <label htmlFor="exercise-search" className="section-label">
                🔍 Search Exercise
              </label>
              <input
                id="exercise-search"
                type="text"
                className="search-input"
                placeholder="Type to search (e.g., Running, Cycling, Yoga...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="results-container">
                <span className="results-header">Results</span>
                <div className="results-list">
                  {filteredTypes.map((ex) => (
                    <div
                      key={ex.name}
                      className={`exercise-item-select ${selectedExercise?.name === ex.name ? "selected" : ""}`}
                      onClick={() => handleExerciseSelect(ex)}
                    >
                      <span className="exercise-emoji">{getExerciseEmoji(ex.name)}</span>
                      <div className="exercise-info">
                        <span className="exercise-name">{ex.name}</span>
                        <span className="exercise-category">{ex.category} (MET: {ex.met})</span>
                      </div>
                      {selectedExercise?.name === ex.name && <span className="check-icon">✓</span>}
                    </div>
                  ))}

                  <div
                    className={`exercise-item-select custom-option ${isCustom ? "selected" : ""}`}
                    onClick={handleSelectCustom}
                  >
                    <span className="exercise-emoji">🛠️</span>
                    <div className="exercise-info">
                      <span className="exercise-name">Log Custom Workout</span>
                      <span className="exercise-category">Enter manual names and calories</span>
                    </div>
                    {isCustom && <span className="check-icon">✓</span>}
                  </div>
                </div>
              </div>
            </div>

            {(selectedExercise || isCustom) && (
              <div className="exercise-customization animate-fade-in">
                <hr className="divider" />

                {/* Duration */}
                <div className="form-group">
                  <label htmlFor="duration-input" className="input-label">Duration (minutes)</label>
                  <input
                    id="duration-input"
                    type="number"
                    min="1"
                    className="form-input"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                    onFocus={(e) => e.target.select()}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>

                {/* Custom exercise fields */}
                {isCustom && (
                  <>
                    <div className="form-group">
                      <label htmlFor="custom-name" className="input-label">Workout Name</label>
                      <input
                        id="custom-name"
                        type="text"
                        placeholder="e.g. Hiking, Basketball"
                        className="form-input"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="custom-category" className="input-label">Category</label>
                      <select
                        id="custom-category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="form-select"
                      >
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Flexibility">Flexibility</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="custom-calories" className="input-label">Calories Burned (kcal)</label>
                      <input
                        id="custom-calories"
                        type="number"
                        min="1"
                        className="form-input"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(Math.max(1, parseInt(e.target.value) || 0))}
                        onFocus={(e) => e.target.select()}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                  </>
                )}

                <hr className="divider" />

                {/* Preview Cards */}
                <div className="preview-container">
                  <span className="preview-title">Energy Burned Preview</span>
                  <div className="calories-value burned-color">{caloriesPreview} kcal</div>
                  
                  {!isCustom && selectedExercise && (
                    <div className="met-info-box" style={{ fontSize: "14px", color: "var(--text-light)", textAlign: "center", marginTop: "10px" }}>
                      Calculated dynamically using standard MET {selectedExercise.met} for your weight of <strong>{userWeight} kg</strong>.
                    </div>
                  )}
                </div>

                <hr className="divider" />

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitLoading}
                  style={{ backgroundColor: "#F44336", boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)" }}
                >
                  {submitLoading ? "Adding Workout..." : "Log Workout"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExercise;
