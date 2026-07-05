import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryCard from "../components/dashboard/SummaryCard";
import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const { dashboard, loading, error } = useDashboard();

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <div
      style={{
        padding: "30px",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <DashboardHeader user={dashboard.user} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <SummaryCard
          title="Goal"
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
    </div>
  );
}

export default Dashboard;