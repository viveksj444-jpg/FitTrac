const SummaryCard = ({ title, value, unit }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>

      <h2>
        {value} {unit}
      </h2>
    </div>
  );
};

export default SummaryCard;