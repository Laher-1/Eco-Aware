import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate("/manage-users");
  };

  const handleAddChallenge = () => {
    navigate("/add-challenge");
  };

  const handleScheduleDrive = () => {
    navigate("/schedule-drive");
  };

  const handleViewRegistrations = () => {
    navigate("/view-registrations");
  };

  const handleManageQuiz = () => {
    navigate("/manage-quiz");
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5em", color: "#1b5e20", marginBottom: "10px" }}>🛠 Admin Dashboard</h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>Manage users, challenges, drives, and quiz</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <button
          onClick={handleManageUsers}
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
            textAlign: "left"
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{ fontSize: "1.5em", color: "#2e7d32", margin: "0 0 10px 0" }}>👥 Manage Users</h3>
          <p style={{ color: "#666", margin: "0" }}>View and manage registered users</p>
        </button>

        <button
          onClick={handleAddChallenge}
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
            textAlign: "left"
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{ fontSize: "1.5em", color: "#2e7d32", margin: "0 0 10px 0" }}>🌱 Add Eco Challenges</h3>
          <p style={{ color: "#666", margin: "0" }}>Create and update sustainability challenges</p>
        </button>

        <button
          onClick={handleScheduleDrive}
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
            textAlign: "left"
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{ fontSize: "1.5em", color: "#2e7d32", margin: "0 0 10px 0" }}>🧹 Schedule Clean Up Drives</h3>
          <p style={{ color: "#666", margin: "0" }}>Add new clean-up drives for the community</p>
        </button>

        <button
          onClick={handleViewRegistrations}
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
            textAlign: "left"
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{ fontSize: "1.5em", color: "#2e7d32", margin: "0 0 10px 0" }}>📝 View Drive Registrations</h3>
          <p style={{ color: "#666", margin: "0" }}>See who has registered for clean-up drives</p>
        </button>

        <button
          onClick={handleManageQuiz}
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.3s, box-shadow 0.3s",
            textAlign: "left"
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          <h3 style={{ fontSize: "1.5em", color: "#2e7d32", margin: "0 0 10px 0" }}>❓ Manage Quiz Questions</h3>
          <p style={{ color: "#666", margin: "0" }}>Create, edit, and delete quiz questions</p>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
