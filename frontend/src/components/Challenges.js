import React, { useState, useEffect } from "react";
import "./Challenges.css";
import { useAuth } from "../context/AuthContext";

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  // ✅ Fetch challenges from backend
  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/challenges');
      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    }
  };

  // ✅ Load saved progress from backend
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/challenges/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.ecopoints !== undefined) {
          setEcoPoints(data.ecopoints);
          const completedCount = data.nooftaskscompleted || 0;
          setChallenges(prev =>
            prev.map((c, idx) =>
              idx < completedCount ? { ...c, progress: 100 } : { ...c, progress: 0 }
            )
          );
        }
      })
      .catch(err => console.error("❌ Error fetching challenges:", err));
  }, [user]);

  const handleComplete = (id) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) => {
        if (challenge.id === id) {
          let newProgress = challenge.progress;

          // Instant completion challenges
          if (challenge.title === "Plant a Tree" || challenge.title === "Participate in Cleanup Drive") {
            newProgress = 100;
          } else {
            newProgress = Math.min(challenge.progress + 100 / 7, 100);
          }

          // Award points only when reaching 100% for the first time
          if (newProgress === 100 && challenge.progress < 100) {
            const updatedPoints = ecoPoints + 10;
            const completedCount = prevChallenges.filter(c => c.progress === 100).length + 1;

            setEcoPoints(updatedPoints);
            setMessage(`🎉 Great job! You completed "${challenge.title}" and earned 10 EcoPoints! 🌍`);
            setTimeout(() => setMessage(""), 4000);

            saveChallengeToDB(updatedPoints, completedCount);
          }

          return { ...challenge, progress: newProgress };
        }
        return challenge;
      })
    );
  };

  const saveChallengeToDB = async (updatedPoints, completedCount) => {
    if (!user) return;
    try {
      await fetch("http://localhost:5000/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          ecopoints: updatedPoints,
          nooftaskscompleted: completedCount
        })
      });
    } catch (error) {
      console.error("❌ Error saving challenge:", error);
    }
  };

  return (
    <div className="challenges-container">
      <h1 className="title">Eco Challenges 🌱</h1>

      <div className="eco-points">
        🌍 Your EcoPoints: <span>{ecoPoints}</span>
      </div>

      {message && <div className="appreciation-message">{message}</div>}

      <div className="cards-container">
        {challenges.map((item) => (
          <div key={item.id} className="challenge-card">
            <img src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.title} className="challenge-image" />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
            </div>
            <p className="progress-text">{Math.round(item.progress)}% completed</p>
            {item.progress < 100 && (
              <button className="join-btn" onClick={() => handleComplete(item.id)}>
                Mark as Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Challenges;
