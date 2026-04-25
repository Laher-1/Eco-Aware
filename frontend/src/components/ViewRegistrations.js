import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [drives, setDrives] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [filterDrive, setFilterDrive] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, userRes, driveRes] = await Promise.all([
          axios.get('http://localhost:5000/api/drive-registrations'),
          axios.get('http://localhost:5000/api/all-users'),
          axios.get('http://localhost:5000/api/scheduled-drives')
        ]);
        setRegistrations(regRes.data);
        setUsers(userRes.data);
        setDrives(driveRes.data.drives);
        setFilteredRegistrations(regRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (filterDrive === '') {
      setFilteredRegistrations(registrations);
    } else {
      setFilteredRegistrations(registrations.filter(reg => reg.drive_id === parseInt(filterDrive)));
    }
  }, [filterDrive, registrations]);

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserEmail = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.email : 'N/A';
  };

  const getDriveTitle = (driveId) => {
    const drive = drives.find(d => d.id === driveId);
    return drive ? drive.title : 'Unknown Drive';
  };

  const getDriveDate = (driveId) => {
    const drive = drives.find(d => d.id === driveId);
    return drive ? new Date(drive.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  };

  const getDriveTime = (driveId) => {
    const drive = drives.find(d => d.id === driveId);
    if (!drive) return 'N/A';
    const [hours, minutes] = drive.time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ color: "#2e7d32" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1400px", margin: "0 auto", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5em", color: "#1b5e20", marginBottom: "10px" }}>📝 Drive Registrations</h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>View and manage all cleanup drive registrations</p>
      </div>

      {/* Filter Section */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <label style={{ fontWeight: "600", color: "#333", marginRight: "15px", fontSize: "1.1em" }}>Filter by Drive:</label>
        <select
          value={filterDrive}
          onChange={(e) => setFilterDrive(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "2px solid #e0e0e0",
            fontSize: "1em",
            cursor: "pointer",
            minWidth: "300px"
          }}
        >
          <option value="">All Drives</option>
          {drives.map(drive => (
            <option key={drive.id} value={drive.id}>
              {drive.title} - {new Date(drive.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderLeft: "4px solid #2e7d32" }}>
          <p style={{ color: "#666", fontSize: "0.9em", margin: "0 0 10px 0" }}>Total Registrations</p>
          <p style={{ fontSize: "2.5em", fontWeight: "bold", color: "#2e7d32", margin: "0" }}>{registrations.length}</p>
        </div>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderLeft: "4px solid #1976d2" }}>
          <p style={{ color: "#666", fontSize: "0.9em", margin: "0 0 10px 0" }}>Total Drives</p>
          <p style={{ fontSize: "2.5em", fontWeight: "bold", color: "#1976d2", margin: "0" }}>{drives.length}</p>
        </div>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderLeft: "4px solid #ff9800" }}>
          <p style={{ color: "#666", fontSize: "0.9em", margin: "0 0 10px 0" }}>Unique Participants</p>
          <p style={{ fontSize: "2.5em", fontWeight: "bold", color: "#ff9800", margin: "0" }}>{new Set(registrations.map(r => r.user_id)).size}</p>
        </div>
      </div>

      {/* Registrations Table Section */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "1.5em", color: "#2e7d32", marginTop: "0" }}>
          Registrations {filterDrive && `for "${getDriveTitle(parseInt(filterDrive))}"`}
        </h2>

        {filteredRegistrations.length === 0 ? (
          <div style={{
            padding: "40px",
            textAlign: "center",
            color: "#999"
          }}>
            <p style={{ fontSize: "1.2em" }}>No registrations found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "1em"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#2e7d32", color: "white" }}>
                  <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Participant</th>
                  <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Drive</th>
                  <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Time</th>
                  <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg, idx) => (
                  <tr key={reg.id} style={{
                    backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                    borderBottom: "1px solid #e0e0e0",
                    transition: "background-color 0.3s"
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = (idx % 2 === 0 ? "#f9f9f9" : "white")}
                  >
                    <td style={{ padding: "15px" }}>
                      <p style={{ margin: "0", fontWeight: "600", color: "#333" }}>{getUserName(reg.user_id)}</p>
                    </td>
                    <td style={{ padding: "15px", color: "#666" }}>{getUserEmail(reg.user_id)}</td>
                    <td style={{ padding: "15px", color: "#333", fontWeight: "500" }}>{getDriveTitle(reg.drive_id)}</td>
                    <td style={{ padding: "15px", color: "#666" }}>{getDriveDate(reg.drive_id)}</td>
                    <td style={{ padding: "15px", color: "#666" }}>{getDriveTime(reg.drive_id)}</td>
                    <td style={{ padding: "15px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: "#c8e6c9",
                        color: "#2e7d32",
                        fontWeight: "600",
                        fontSize: "0.9em"
                      }}>
                        ✓ Registered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Section */}
      {filteredRegistrations.length > 0 && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginTop: "30px"
        }}>
          <p style={{ color: "#666", margin: "0" }}>
            <span style={{ fontWeight: "600", color: "#2e7d32" }}>{filteredRegistrations.length}</span> registrations shown
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewRegistrations;