import "./Dashboard.css";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryCard from "../components/dashboard/SummaryCard";
import MacroCard from "../components/dashboard/MacroCard";
import CalorieProgress from "../components/dashboard/CalorieProgress";
import TodayMeals from "../components/dashboard/TodayMeals";
import TodayExercises from "../components/dashboard/TodayExercises";

import useDashboard from "../hooks/useDashboard";
import useMeals from "../hooks/useMeals";
import useExercises from "../hooks/useExercises";
import { deleteExercise } from "../services/exerciseService";

function Dashboard() {
  const {
    dashboard,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useDashboard();

  const {
    meals,
    loading: mealsLoading,
    error: mealsError,
  } = useMeals();

  const {
    exercises,
    loading: exercisesLoading,
    error: exercisesError,
    refetch: refetchExercises,
  } = useExercises();

  const handleDeleteExercise = async (id) => {
    try {
      await deleteExercise(id);
      refetchDashboard();
      refetchExercises();
    } catch (err) {
      console.error("Failed to delete exercise:", err);
    }
  };

  if (dashboardLoading || mealsLoading || exercisesLoading) {
    return <h2>Loading Dashboard...</h2>;
  }

  if (dashboardError) {
    return <h2>{dashboardError}</h2>;
  }

  if (mealsError) {
    return <h2>{mealsError}</h2>;
  }

  if (exercisesError) {
    return <h2>{exercisesError}</h2>;
  }

  return (
    <div className="dashboard">

      <DashboardHeader user={dashboard.user} />

      <div className="summary-grid">

        <SummaryCard
          title="Daily Goal"
          value={dashboard.calories.goal}
          unit="kcal"
        />

        <SummaryCard
          title="Consumed"
          value={dashboard.calories.consumed}
          unit="kcal"
        />

        <SummaryCard
          title="Burned"
          value={dashboard.calories.burned}
          unit="kcal"
        />

        <SummaryCard
          title="Net Calories"
          value={dashboard.calories.net}
          unit="kcal"
        />

        <SummaryCard
          title="Remaining"
          value={dashboard.calories.remaining}
          unit="kcal"
        />

      </div>

      <div className="macro-section">

        <div className="macro-grid">

          <MacroCard
            title="Protein"
            consumed={dashboard.macros.protein.consumed}
            goal={dashboard.macros.protein.goal}
            progress={dashboard.macros.protein.progress}
            color="#4CAF50"
          />

          <MacroCard
            title="Carbohydrates"
            consumed={dashboard.macros.carbs.consumed}
            goal={dashboard.macros.carbs.goal}
            progress={dashboard.macros.carbs.progress}
            color="#FF9800"
          />

          <MacroCard
            title="Fat"
            consumed={dashboard.macros.fat.consumed}
            goal={dashboard.macros.fat.goal}
            progress={dashboard.macros.fat.progress}
            color="#F44336"
          />

        </div>

        <CalorieProgress
          consumed={dashboard.calories.consumed}
          goal={dashboard.calories.goal}
          remaining={dashboard.calories.remaining}
          progress={dashboard.calories.progress}
        />

      </div>

      <div className="dashboard-logs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginTop: "35px" }}>
        <TodayMeals meals={meals} />
        <TodayExercises exercises={exercises} onDelete={handleDeleteExercise} />
      </div>

    </div>
  );
}

export default Dashboard;