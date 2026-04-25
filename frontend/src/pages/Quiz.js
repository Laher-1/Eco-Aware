import React, { useState, useEffect } from "react";
import "./Quiz.css";

function Quiz() {
  const [quizData, setQuizData] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/quiz");
        const data = await res.json();
        setQuizData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // ✅ Load user_id from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  const handleNext = () => {
    let newScore = score;
    let newEcoPoints = ecoPoints;

    if (selected === quizData[currentQ].answer) {
      newScore += 1;
      newEcoPoints += 2;
      setScore(newScore);
      setEcoPoints(newEcoPoints);
    }

    setSelected("");

    if (currentQ + 1 < quizData.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);

      if (userId) {
        const resultData = {
          user_id: userId,
          score: newScore,
          ecoPoints: newEcoPoints,
          quiz_time: new Date().toISOString()
        };

        // ✅ Save to backend (MySQL)
        fetch("http://localhost:5000/api/quiz-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultData)
        })
          .then(res => res.json())
          .then(data => {
            console.log("Result saved to DB:", data);
          })
          .catch(err => {
            console.error("Error saving result to DB:", err);
          });

        // ✅ Save to localStorage for instant frontend history
        const existingResults = JSON.parse(localStorage.getItem("quiz_results")) || [];
        existingResults.push(resultData);
        localStorage.setItem("quiz_results", JSON.stringify(existingResults));

      } else {
        console.error("No user_id found. Make sure user is logged in.");
      }
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Loading Quiz...</h1>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">No Questions Available</h1>
        <p>Admin needs to add questions to the quiz.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Sustainability Quiz 🌱</h1>

      {showResult ? (
        <div className="result-box">
          <h2>Your Score: {score}/{quizData.length}</h2>
          <h3>Total EcoPoints Earned: {ecoPoints}</h3>
          <button onClick={() => window.location.reload()}>
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-card">
          <h2 className="question">{quizData[currentQ].question}</h2>

          <div className="options">
            {quizData[currentQ].options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selected === option ? "active" : ""}`}
                onClick={() => setSelected(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            className="next-btn"
            onClick={handleNext}
            disabled={!selected}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
