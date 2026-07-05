const DashboardHeader = ({ user }) => {
  return (
    <div
      style={{
        marginBottom: "30px",
        padding: "20px",
        borderRadius: "12px",
        background: "#f5f5f5",
      }}
    >
      <h1>Welcome {user?.name || "User"} 👋</h1>
      <p>Track your daily calories and stay healthy.</p>
    </div>
  );
};

export default DashboardHeader;