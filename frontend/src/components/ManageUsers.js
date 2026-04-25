import React, { useState, useEffect } from "react";
import "../pages/AdminDashboard.css";

function ManageUsers() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userRecord, setUserRecord] = useState(null);
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/all-users")
      .then(res => res.json())
      .then(data => setAllUsers(data.filter(user => user.role !== 'admin')))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const handleSearch = () => {
    setError("");
    setUserRecord(null);
    setSearchActive(true);

    const user = allUsers.find(u => u.email === email && u.name === name);
    if (user) {
      setUserRecord(user);
    } else {
      setError("User not found");
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5em", color: "#1b5e20", marginBottom: "10px" }}>👥 Manage Users</h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>Search and view user information and sustainability stats</p>
      </div>

      {/* Search Section */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h2 style={{ fontSize: "1.5em", color: "#2e7d32", marginBottom: "20px" }}>🔍 Search User</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "15px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1em",
                transition: "border-color 0.3s"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1em",
                transition: "border-color 0.3s"
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              padding: "12px 30px",
              backgroundColor: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1em",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#1b5e20"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#2e7d32"}
          >
            Search
          </button>
        </div>
        {error && <p style={{ color: "#d32f2f", marginTop: "15px", fontSize: "1.1em", fontWeight: "600" }}>❌ {error}</p>}
      </div>

      {/* User Details Section */}
      {userRecord && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <h2 style={{ fontSize: "1.5em", color: "#2e7d32", marginBottom: "20px" }}>👤 User Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#666", fontSize: "0.9em", marginBottom: "5px" }}>User ID</p>
              <p style={{ fontSize: "1.3em", fontWeight: "bold", color: "#333" }}>{userRecord.user_id}</p>
            </div>
            <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#666", fontSize: "0.9em", marginBottom: "5px" }}>Name</p>
              <p style={{ fontSize: "1.3em", fontWeight: "bold", color: "#333" }}>{userRecord.name}</p>
            </div>
            <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#666", fontSize: "0.9em", marginBottom: "5px" }}>Email</p>
              <p style={{ fontSize: "1.3em", fontWeight: "bold", color: "#333", wordBreak: "break-all" }}>{userRecord.email}</p>
            </div>
            <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
              <p style={{ color: "#666", fontSize: "0.9em", marginBottom: "5px" }}>Role</p>
              <p style={{ fontSize: "1.3em", fontWeight: "bold", color: userRecord.role === "admin" ? "#d32f2f" : "#2e7d32" }}>
                {userRecord.role === "admin" ? "👑 Admin" : "👤 User"}
              </p>
            </div>
          </div>

          <h3 style={{ fontSize: "1.3em", color: "#2e7d32", marginBottom: "15px" }}>🌱 Sustainability Stats</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div style={{ backgroundColor: "#e8f5e9", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #4caf50" }}>
              <p style={{ color: "#666", fontSize: "0.9em" }}>Completed Challenges</p>
              <p style={{ fontSize: "2em", fontWeight: "bold", color: "#2e7d32" }}>{userRecord.completed_challenges || 0}</p>
            </div>
            <div style={{ backgroundColor: "#fff3e0", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #ff9800" }}>
              <p style={{ color: "#666", fontSize: "0.9em" }}>Eco Points</p>
              <p style={{ fontSize: "2em", fontWeight: "bold", color: "#ff9800" }}>{userRecord.eco_points || 0}</p>
            </div>
            <div style={{ backgroundColor: "#e3f2fd", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #1976d2" }}>
              <p style={{ color: "#666", fontSize: "0.9em" }}>Carbon Reduced</p>
              <p style={{ fontSize: "2em", fontWeight: "bold", color: "#1976d2" }}>{userRecord.carbon_reduced || 0} kg</p>
            </div>
            <div style={{ backgroundColor: "#f3e5f5", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #9c27b0" }}>
              <p style={{ color: "#666", fontSize: "0.9em" }}>Recycling Streak</p>
              <p style={{ fontSize: "2em", fontWeight: "bold", color: "#9c27b0" }}>{userRecord.recycling_streak || 0} days</p>
            </div>
          </div>
        </div>
      )}

      {/* All Users Table Section */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "1.5em", color: "#2e7d32", marginBottom: "20px" }}>📊 All Users</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "1em"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#2e7d32", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Name</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Email</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Role</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Challenges</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Eco Points</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user, idx) => (
                <tr key={user.user_id} style={{
                  backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                  borderBottom: "1px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                onMouseOut={e => e.currentTarget.style.backgroundColor = (idx % 2 === 0 ? "#f9f9f9" : "white")}
                >
                  <td style={{ padding: "15px" }}>{user.user_id}</td>
                  <td style={{ padding: "15px", fontWeight: "500" }}>{user.name}</td>
                  <td style={{ padding: "15px", color: "#666" }}>{user.email}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      backgroundColor: user.role === "admin" ? "#ffebee" : "#e8f5e9",
                      color: user.role === "admin" ? "#d32f2f" : "#2e7d32",
                      fontWeight: "600",
                      fontSize: "0.9em"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>{user.completed_challenges || 0}</td>
                  <td style={{ padding: "15px", fontWeight: "600", color: "#2e7d32" }}>{user.eco_points || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
