import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddChallenge = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/challenges');
      setChallenges(res.data);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    try {
      await axios.post('http://localhost:5000/api/add-challenge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ Challenge added successfully!');
      setMessageType('success');
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      fetchChallenges();
    } catch (err) {
      setMessage('❌ Error adding challenge. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/delete-challenge/${id}`);
      setMessage('✅ Challenge deleted successfully!');
      setMessageType('success');
      fetchChallenges();
    } catch (err) {
      setMessage('❌ Error deleting challenge. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5em", color: "#1b5e20", marginBottom: "10px" }}>🌱 Add Eco Challenge</h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>Create new sustainability challenges for the community</p>
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
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
              Challenge Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Reduce plastic use for a week"
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
              Description *
            </label>
            <textarea
              placeholder="Describe the challenge and its environmental impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="5"
              style={{
                width: "100%",
                padding: "14px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1em",
                boxSizing: "border-box",
                resize: "vertical",
                transition: "border-color 0.3s"
              }}
              onFocus={e => e.target.style.borderColor = "#2e7d32"}
              onBlur={e => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
              Challenge Image (optional)
            </label>
            <div style={{
              border: "2px dashed #2e7d32",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#f0f8ed"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-input"
              />
              <label htmlFor="image-input" style={{ cursor: "pointer" }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
                ) : (
                  <div>
                    <div style={{ fontSize: "2em", marginBottom: "10px" }}>📸</div>
                    <p style={{ color: "#2e7d32", fontWeight: "600", margin: "0" }}>Click to upload or drag an image</p>
                    <p style={{ color: "#999", fontSize: "0.9em", margin: "5px 0 0 0" }}>PNG, JPG up to 5MB</p>
                  </div>
                )}
              </label>
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
            {isLoading ? "Adding Challenge..." : "Add Challenge"}
          </button>
        </form>
      </div>

      {/* Challenges List Section */}
      <div>
        <h2 style={{ fontSize: "1.8em", color: "#2e7d32", marginBottom: "20px" }}>📋 Existing Challenges ({challenges.length})</h2>
        {challenges.length === 0 ? (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            color: "#999"
          }}>
            <p style={{ fontSize: "1.2em" }}>No challenges yet. Create your first one!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {challenges.map(challenge => (
              <div key={challenge.id} style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer"
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
                {challenge.image && (
                  <img src={challenge.image} alt={challenge.title} style={{ width: "100%", borderRadius: "8px", marginBottom: "15px", maxHeight: "200px", objectFit: "cover" }} />
                )}
                <h3 style={{ color: "#2e7d32", marginTop: "0" }}>{challenge.title}</h3>
                <p style={{ color: "#666", fontSize: "0.95em", marginBottom: "15px" }}>{challenge.description}</p>
                <button
                  onClick={() => handleDelete(challenge.id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.95em",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = "#d32f2f"}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = "#f44336"}
                >
                  Delete Challenge
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddChallenge;