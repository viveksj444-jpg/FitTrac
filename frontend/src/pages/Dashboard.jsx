import useDashboard from "../hooks/useDashboard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import "./Dashboard.css";

function Dashboard() {
  const { dashboard, loading, error } = useDashboard();

  if (loading) return <h1>Loading...</h1>;

  if (error) return <h1>{error}</h1>;

  return (
    <div className="dashboard">
      <DashboardHeader user={dashboard.user} />
    </div>
  );
}

export default Dashboard;