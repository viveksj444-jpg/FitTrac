import "./Dashboard.css";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryCard from "../components/dashboard/SummaryCard";
import NetCaloriesCard from "../components/dashboard/NetCaloriesCard";
import MacroCard from "../components/dashboard/MacroCard";
import CalorieProgress from "../components/dashboard/CalorieProgress";
import WaterCard from "../components/water/WaterCard";
import NetCaloriesCharts from "../components/dashboard/NetCaloriesCharts";
import DashboardInsights from "../components/dashboard/DashboardInsights";
import TodayMeals from "../components/dashboard/TodayMeals";
import TodayExercises from "../components/dashboard/TodayExercises";
import QuickActions from "../components/dashboard/QuickActions";

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
    return (
      <div className="dashboard-loading">
        <h2>🔥 Loading Dashboard...</h2>
      </div>
    );
  }

  if (dashboardError) {
    return <div className="dashboard-error"><h2>{dashboardError}</h2></div>;
  }

  if (mealsError) {
    return <div className="dashboard-error"><h2>{mealsError}</h2></div>;
  }

  if (exercisesError) {
    return <div className="dashboard-error"><h2>{exercisesError}</h2></div>;
  }

  return (
    <div className="dashboard">
      {/* 1. Header */}
      <DashboardHeader user={dashboard.user} />

      {/* 2. Summary Cards */}
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

      {/* 3. Net Calories Card ⭐ (Centerpiece) */}
      <div className="centerpiece-section">
        <NetCaloriesCard
          consumed={dashboard.calories.consumed}
          burned={dashboard.calories.burned}
          netCalories={dashboard.calories.net}
          goal={dashboard.calories.goal}
          remaining={dashboard.calories.remaining}
          progress={dashboard.calories.progress}
        />
      </div>

      {/* 4. Macro Cards & Progress */}
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

      {/* 5. Water Card & 6. Analytics Charts */}
      <div className="water-analytics-grid">
        <WaterCard />
        <NetCaloriesCharts
          netCalories={dashboard.calories.net}
          consumed={dashboard.calories.consumed}
          burned={dashboard.calories.burned}
          goal={dashboard.calories.goal}
        />
      </div>

      {/* 7. Dashboard Insights */}
      <DashboardInsights
        burned={dashboard.calories.burned}
        remaining={dashboard.calories.remaining}
        netCalories={dashboard.calories.net}
        goal={dashboard.calories.goal}
        macros={dashboard.macros}
      />

      {/* 8. Today's Meals & Today's Exercises */}
      <div className="dashboard-logs">
        <TodayMeals meals={meals} />
        <TodayExercises exercises={exercises} onDelete={handleDeleteExercise} />
      </div>

      {/* 9. Quick Actions */}
      <div className="quick-actions-wrapper">
        <QuickActions />
      </div>
    </div>
  );
}

export default Dashboard;