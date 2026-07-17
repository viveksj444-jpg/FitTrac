import { useNavigate } from "react-router-dom";
import "./ActionButton.css";

const ActionButton = ({
  icon,
  title,
  subtitle,
  to,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      className="action-button"
      onClick={handleClick}
    >
      <div className="action-icon">
        {icon}
      </div>

      <div className="action-content">
        <h3>{title}</h3>

        {subtitle && <p>{subtitle}</p>}
      </div>
    </button>
  );
};

export default ActionButton;