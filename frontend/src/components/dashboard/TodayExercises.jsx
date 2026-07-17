import { Link } from "react-router-dom";
import "./TodayExercises.css";

const TodayExercises = ({ exercises = [], onDelete }) => {
  const totalBurned = exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);

  return (
    <div className="today-exercises">
      <div className="today-exercises-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "30px" }}>
        <div>
          <h2>🏃 Today's Exercises</h2>
          <p style={{ margin: "4px 0 0 0", color: "#777" }}>Your workouts logged for today</p>
        </div>
        <Link to="/add-exercise" className="add-exercise-link-btn" style={{
          backgroundColor: "#F44336",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 4px 10px rgba(244, 67, 54, 0.2)",
          transition: "all var(--transition)"
        }}>
          + Add Exercise
        </Link>
      </div>

      <div className="exercises-card">
        <div className="exercises-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 600, color: "var(--text)" }}>Workouts</h3>
          <span style={{ fontSize: "18px", fontWeight: 600, color: "#F44336" }}>{totalBurned} kcal burned</span>
        </div>

        {exercises.length === 0 ? (
          <div className="empty-exercises" style={{ textAlign: "center", color: "var(--text-light)", padding: "40px 0" }}>
            <p style={{ marginBottom: "15px" }}>No workouts logged today.</p>
            <Link to="/add-exercise" className="add-exercise-inline-btn" style={{
              display: "inline-block",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "var(--border)",
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all var(--transition)"
            }}>Log Workout</Link>
          </div>
        ) : (
          <div className="exercises-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {exercises.map((ex) => (
              <div className="exercise-item" key={ex._id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "15px",
                transition: "all var(--transition)"
              }}>
                <div className="exercise-details">
                  <h4 style={{ margin: 0, fontSize: "18px", color: "var(--text)" }}>{ex.name}</h4>
                  <p style={{ margin: "6px 0 0 0", color: "var(--text-light)", fontSize: "14px" }}>
                    {ex.category} • {ex.duration} mins
                  </p>
                </div>
                <div className="exercise-actions" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <strong style={{ color: "#F44336", fontSize: "18px" }}>-{ex.caloriesBurned} kcal</strong>
                  <button 
                    onClick={() => onDelete(ex._id)} 
                    className="delete-exercise-btn"
                    title="Delete Workout"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999",
                      fontSize: "24px",
                      cursor: "pointer",
                      padding: "0 5px",
                      lineHeight: 1,
                      transition: "color var(--transition)"
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayExercises;
