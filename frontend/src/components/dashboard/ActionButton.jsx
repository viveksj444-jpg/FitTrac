import { useNavigate } from "react-router-dom";
import "./ActionButton.css";

const ActionButton = ({ icon, title, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button className="action-button" onClick={handleClick}>
      <div className="action-icon">{icon}</div>
      <span className="action-title">{title}</span>
    </button>
  );
};

export default ActionButton;