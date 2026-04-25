import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleDrive = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [drives, setDrives] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !location.trim()) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/schedule-drive', { title, date, time, location });
      setMessage('✅ Cleanup drive scheduled successfully!');
      setMessageType('success');
      setTitle('');
      setDate('');
      setTime('');
      setLocation('');
      fetchDrives();
    } catch (err) {
      setMessage('❌ Error scheduling drive');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/scheduled-drives');
      setDrives(res.data.drives);
    } catch (err) {
      console.error('Error fetching drives');
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5em", color: "#1b5e20", marginBottom: "10px" }}>🧹 Schedule Cleanup Drive</h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>Organize community cleanup events and manage registrations</p>
      </div>

      {/* Form Section */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "40px",
        maxWidth: "700px"
      }}>
        <h2 style={{ color: "#2e7d32", marginTop: "0" }}>📅 Create New Drive</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
              Drive Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Beach Cleanup Day 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1em",
                boxSizing: "border-box",
                transition: "border-color 0.3s"
              }}
              onFocus={e => e.target.style.borderColor = "#2e7d32"}
              onBlur={e => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
              Location *
            </label>
            <input
              type="text"
              placeholder="e.g., Central Park, New York"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1em",
                boxSizing: "border-box",
                transition: "border-color 0.3s"
              }}
              onFocus={e => e.target.style.borderColor = "#2e7d32"}
              onBlur={e => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "1em",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s"
                }}
                onFocus={e => e.target.style.borderColor = "#2e7d32"}
                onBlur={e => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
                Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "1em",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s"
                }}
                onFocus={e => e.target.style.borderColor = "#2e7d32"}
                onBlur={e => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>
          </div>

          {message && (
            <div style={{
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              backgroundColor: messageType === 'success' ? "#c8e6c9" : "#ffcdd2",
              color: messageType === 'success' ? "#2e7d32" : "#d32f2f",
              fontSize: "1.1em",
              fontWeight: "600"
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: isLoading ? "#ccc" : "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1em",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={e => !isLoading && (e.currentTarget.style.backgroundColor = "#1b5e20")}
            onMouseOut={e => !isLoading && (e.currentTarget.style.backgroundColor = "#2e7d32")}
          >
            {isLoading ? "Scheduling..." : "Schedule Drive"}
          </button>
        </form>
      </div>

      {/* Drives List Section */}
      <div>
        <h2 style={{ fontSize: "1.8em", color: "#2e7d32", marginBottom: "20px" }}>📋 Scheduled Drives ({drives.length})</h2>
        {drives.length === 0 ? (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            color: "#999"
          }}>
            <p style={{ fontSize: "1.2em" }}>No drives scheduled yet. Create your first cleanup drive!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {drives.map(drive => (
              <div key={drive.id} style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderTop: "4px solid #2e7d32",
                transition: "transform 0.3s, box-shadow 0.3s"
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
                <h3 style={{ color: "#2e7d32", marginTop: "0" }}>{drive.title}</h3>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", color: "#666" }}>
                  <span style={{ marginRight: "10px", fontSize: "1.2em" }}>📍</span>
                  <span>{drive.location || "Location not specified"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", color: "#666" }}>
                  <span style={{ marginRight: "10px", fontSize: "1.2em" }}>📅</span>
                  <span>{formatDate(drive.date)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", color: "#666" }}>
                  <span style={{ marginRight: "10px", fontSize: "1.2em" }}>⏰</span>
                  <span>{formatTime(drive.time)}</span>
                </div>
                <p style={{ color: "#999", fontSize: "0.9em", marginTop: "15px" }}>ID: {drive.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleDrive;