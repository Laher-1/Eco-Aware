import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useAuth } from "../context/AuthContext";

function UserDashboard(){
  const { user } = useAuth();
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [recentChallengeTitles, setRecentChallengeTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [footprintRes, userChallengesRes, allChallengesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/footprint/${user.user_id}`),
          fetch(`http://localhost:5000/api/challenges/${user.user_id}`),
          fetch(`http://localhost:5000/api/challenges`)
        ]);

        const footprintData = await footprintRes.json();
        const userChallengesData = await userChallengesRes.json();
        const allChallengesData = await allChallengesRes.json();

        setCarbonFootprint(footprintData.footprint);
        const points = userChallengesData.ecopoints || 0;
        const completedCount = userChallengesData.nooftaskscompleted || 0;
        setEcoPoints(points);
        setCompletedChallenges(completedCount);

        // Map completed challenges to recent activities
        if (completedCount > 0 && Array.isArray(allChallengesData)) {
          const completedTitles = allChallengesData
            .slice(0, completedCount)
            .map((challenge) => challenge.title);
          setRecentChallengeTitles(completedTitles);
        } else {
          setRecentChallengeTitles([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="dashboard-container"><h1>Loading...</h1></div>;
  }

return(

<div className="dashboard-container">

<h1>Your Sustainability Dashboard</h1>
<p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '30px' }}>Track your eco-friendly journey and make a positive impact on the planet.</p>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>

<div style={{ backgroundColor: '#f0f8e7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
<h3>🌱 Completed Challenges</h3>
<p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32' }}>{completedChallenges}</p>
<p>Keep up the great work!</p>
</div>

<div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
<h3>💚 Eco Points</h3>
<p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32' }}>{ecoPoints}</p>
<p>Earn more by completing challenges.</p>
</div>

<div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
<h3>🌍 Carbon Footprint</h3>
<p style={{ fontSize: '36px', fontWeight: 'bold', color: '#1976d2' }}>{carbonFootprint ? `${carbonFootprint} kg CO2` : 'Not calculated yet'}</p>
<p>{carbonFootprint ? 'Your latest calculation' : 'Take the calculator to see your footprint'}</p>
</div>

</div>

<div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
<h3>Recent Activities</h3>
<ul style={{ listStyleType: 'none', padding: 0 }}>
{recentChallengeTitles.length > 0 ? (
  recentChallengeTitles.map((title, idx) => (
    <li key={idx}>✅ Completed "{title}" challenge</li>
  ))
) : (
  <li>No completed challenges yet. Complete your first challenge to see it here!</li>
)}
<li>✅ Earned {ecoPoints} eco points</li>
<li>✅ Joined community cleanup drive</li>
</ul>
</div>

</div>

)

}

export default UserDashboard;