import "./Dashboard.css";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryCard from "../components/dashboard/SummaryCard";
import MacroCard from "../components/dashboard/MacroCard";
import useDashboard from "../hooks/useDashboard";
import CalorieProgress from "../components/dashboard/CalorieProgress";

function Dashboard() {
  const { dashboard, loading, error } = useDashboard();

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <DashboardHeader user={dashboard.user} />

      {/* Summary Cards */}
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
          title="Remaining"
          value={dashboard.calories.remaining}
          unit="kcal"
        />
      </div>

      {/* Macro Cards */}
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
  );
}

export default Dashboard;