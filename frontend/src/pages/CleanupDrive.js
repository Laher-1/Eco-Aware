import React, { useEffect, useState } from "react";
import "./CleanupDrive.css";
import axios from "axios";
import juhuImg from "../assets/cleanup/juhu_cleanup.png";
import gangaImg from "../assets/cleanup/ganga_cleanup.jpg";
import marineImg from "../assets/cleanup/marine_cleanup.jpeg";


function CleanupDrive() {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/scheduled-drives");
        setDrives(res.data.drives);
      } catch (error) {
        console.error("Error fetching drives:", error);
      }
    };
    fetchDrives();
  }, []);

  const handleJoin = async (driveId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to join a drive.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/join-drive", {
        user_id: parseInt(userId),
        drive_id: driveId
      });
      alert("Successfully joined the drive!");
      console.log(response.data);
    } catch (error) {
      console.error("Error joining drive:", error);
      alert("Failed to join the drive. Please try again.");
    }
  };

  return (
    <div className="drive-container">
      <h1>🌿 Community Clean Up Drives</h1>
      <p>Join our mission to make the environment cleaner and greener.</p>

      {/* Static Past Info Section */}
      <div className="past-cleanup-section">
        <h2>Past Clean Up Highlights</h2>
        <p>
          Our community has already made a big difference! Together, we’ve collected 
          <strong> over 2,000 kg of waste </strong> and engaged more than 
          <strong> 500 volunteers </strong> across India.
        </p>

        <div className="impact-stats">
          <div className="stat-card">
            <h3>🌱 2,000 kg</h3>
            <p>Plastic waste removed</p>
          </div>
          <div className="stat-card">
            <h3>👥 500+</h3>
            <p>Volunteers joined</p>
          </div>
          <div className="stat-card">
            <h3>🏖️ 12</h3>
            <p>Locations cleaned</p>
          </div>
        </div>

        <div className="past-cleanup-gallery">
          <div className="cleanup-card">
            <img src={juhuImg} alt="Juhu Beach Cleanup" />
            <h3>Juhu Beach</h3>
            <p>120 volunteers collected 300 kg of plastic waste.</p>
          </div>

          <div className="cleanup-card">
            <img src={gangaImg} alt="Ganga River Cleanup" />
            <h3>Ganga River</h3>
            <p>200 volunteers worked together to restore the riverbank.</p>
          </div>

          <div className="cleanup-card">
            <img src={marineImg} alt="Marine Drive Cleanup" />
            <h3>Marine Drive</h3>
            <p>80 volunteers cleared debris along the promenade.</p>
          </div>
        </div>

        <div className="volunteer-stories">
          <blockquote>
            “It felt amazing to see the beach clean again — teamwork made it possible!”
          </blockquote>
          <blockquote>
            “I joined to make a difference, and I left with new friends and hope.”
          </blockquote>
        </div>

        <p className="join-statement">
          Seeing the impact of these past drives, we’re confident you’ll be inspired to 
          <strong> join our next clean‑up mission </strong> and be part of the change!
        </p>
      </div>

      {/* Upcoming Drives Section */}
      <h2><strong>Our Upcoming Drives</strong></h2>
      <div className="drive-grid">
        {drives.map((drive, index) => (
          <div className="drive-card" key={index}>
            <h3>{drive.title}</h3>
            <p>📅 Date: {drive.date}</p>
            <p>⏰ Time: {drive.time}</p>
            <button onClick={() => handleJoin(drive.id)}>Join Drive</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CleanupDrive;
