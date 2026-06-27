import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } =
    useContext(AuthContext);

  return (
    <nav>
      <h2>FitTrac</h2>

      {token && (
        <button onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;