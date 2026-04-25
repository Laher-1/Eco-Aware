import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Sustainability Awareness"
          className="dashboard-main-image"
        />
        <h1>Your Sustainability Dashboard</h1>
        <p>Track your eco-friendly journey and make a positive impact on the planet.</p>
        <Link to="/user-dashboard" className="dashboard-link">View Detailed Dashboard</Link>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>🌱 Completed Challenges</h3>
          <p className="card-value">3</p>
          <p>Keep up the great work!</p>
        </div>
        <div className="dashboard-card">
          <h3>💚 Eco Points</h3>
          <p className="card-value">120</p>
          <p>Earn more by completing challenges.</p>
        </div>
        <div className="dashboard-card">
          <h3>🌍 Carbon Footprint Reduced</h3>
          <p className="card-value">15 kg CO2</p>
          <p>This month</p>
        </div>
        <div className="dashboard-card">
          <h3>♻️ Recycling Streak</h3>
          <p className="card-value">7 days</p>
          <p>Don't break the chain!</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Activities</h2>
        <ul className="activity-list">
          <li>Completed "Reduce Plastic Use" challenge</li>
          <li>Earned 50 eco points for carpooling</li>
          <li>Joined community cleanup drive</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;