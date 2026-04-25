import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/actions/authActions';
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, role } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    // Call backend logout route to clear cookie
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include" // ensures cookies are sent
    });

    // Clear local state
    dispatch(logout());

    // Navigate to home
    navigate("/");
  } catch (error) {
    console.error("❌ Error logging out:", error);
  }
};


  return (
    <nav className="navbar">

      <Link to="/" className="logo">EcoAware 🌱</Link>

      <div className="nav-buttons">
        <Link to="/aboutus" className="nav-btn">AboutUs</Link>
        <Link to="/dashboard" className="nav-btn">Dashboard</Link>
        {isLoggedIn && role === 'user' && (
          <Link to="/calculator" className="nav-btn">Calculator</Link>
        )}
        {isLoggedIn && (
          <>
            <Link to="/challenges" className="nav-btn">Challenges</Link>
            <Link to="/CleanupDrive" className="nav-btn">CleanupDrive</Link>
            <Link to="/quiz" className="nav-btn">Quiz</Link>
          </>
        )}
        {!isLoggedIn ? (
          <Link to="/login" className="nav-btn">Login</Link>
        ) : (
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        )}
      </div>

    </nav>
  );
}

export default Navbar;