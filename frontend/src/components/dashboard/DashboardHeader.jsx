import "./DashboardHeader.css";

const DashboardHeader = ({ user }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="dashboard-header">
      <div>
        <h1>Welcome {user?.name} 👋</h1>
        <p>Track your daily calories and stay healthy.</p>
      </div>

      <div className="dashboard-date">{today}</div>
    </div>
  );
};

export default DashboardHeader;