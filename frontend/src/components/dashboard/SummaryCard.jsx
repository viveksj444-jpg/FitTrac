import "./SummaryCard.css";

const SummaryCard = ({ title, value, unit }) => {
  return (
    <div className="summary-card">
      <h4>{title}</h4>

      <h2>
        {value} <span>{unit}</span>
      </h2>
    </div>
  );
};

export default SummaryCard;