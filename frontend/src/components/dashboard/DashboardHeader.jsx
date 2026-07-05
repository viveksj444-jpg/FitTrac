const DashboardHeader = ({ user }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h1>Welcome {user?.name} 👋</h1>
      <p>Track your daily calories and stay healthy.</p>
    </div>
  );
};

export default DashboardHeader;