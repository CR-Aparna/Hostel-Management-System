import { useNavigate } from "react-router-dom";

function Navbar({ title }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">
      <h3>{title}</h3>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;
