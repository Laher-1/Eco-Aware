import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleDrive = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  const handleSchedule = async (e) => {
    e.preventDefault();

    try {
      // Ensure time has seconds for MySQL TIME type
      const formattedTime = time.length === 5 ? time + ":00" : time;

      await axios.post("http://localhost:5000/api/schedule-drive", {
        title,
        date,          // already in YYYY-MM-DD format
        time: formattedTime
      });

      alert("Drive scheduled successfully!");

      // Reset form fields
      setTitle("");
      setDate("");
      setTime("");

      // Navigate to cleanup drive list
      navigate("/CleanupDrive");

    } catch (error) {
      console.error("Error scheduling drive:", error);
      alert("Error scheduling drive");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Schedule Drive 🌱</h2>
        <form onSubmit={handleSchedule}>
          <input
            type="text"
            placeholder="Name of Drive"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <button type="submit">Schedule Drive</button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleDrive;
