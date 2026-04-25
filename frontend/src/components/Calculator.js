import React, { useState } from "react";
import "./Calculator.css";
import { useAuth } from "../context/AuthContext";

function Calculator() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [ecoPoints, setEcoPoints] = useState(null);

  const { user } = useAuth();
  const userId = user?.user_id;

  const questions = {
    1: { category: "Food", text: "How would you best describe your diet?", options: [
      { label: "Meat in every meal", value: 30 },
      { label: "Meat in some meals", value: 20 },
      { label: "No beef", value: 15 },
      { label: "Meat very rarely", value: 10 },
      { label: "Vegetarian", value: 8 },
      { label: "Vegan", value: 5 },
    ]},
    2: { category: "Food", text: "Of the food you buy how much is wasted?", options: [
      { label: "None", value: 0 },
      { label: "0% - 10%", value: 5 },
      { label: "10% - 30%", value: 15 },
      { label: "More than 30%", value: 25 },
    ]},
    3: { category: "Food", text: "How often do you buy locally produced food?", options: [
      { label: "A lot of the food I buy is locally sourced", value: 5 },
      { label: "Some of the food I buy is locally sourced", value: 10 },
      { label: "I don’t worry about where my food comes from", value: 20 },
    ]},
    4: { category: "Travel", text: "What kind of vehicle do you travel in most often?", options: [
      { label: "Car", value: 25 },
      { label: "Motorbike", value: 20 },
      { label: "Neither - I walk/cycle/public transport", value: 5 },
    ]},
    5: { category: "Travel", text: "How many hours a week do you spend on the train?", options: [
      { label: "I don’t travel by train", value: 0 },
      { label: "Under 2 hours", value: 5 },
      { label: "2 to 5 hours", value: 10 },
      { label: "5 to 15 hours", value: 15 },
      { label: "15 to 25 hours", value: 20 },
      { label: "Over 25 hours", value: 25 },
    ]},
    6: { category: "Travel", text: "How many hours a week do you spend on the bus?", options: [
      { label: "I don’t travel by bus", value: 0 },
      { label: "Under 1 hour", value: 5 },
      { label: "1 to 3 hours", value: 10 },
      { label: "3 to 6 hours", value: 15 },
      { label: "6 to 10 hours", value: 20 },
      { label: "Over 10 hours", value: 25 },
    ]},
    7: { category: "Travel", text: "What percentage of your flights do you offset?", options: [
      { label: "None of them", value: 25 },
      { label: "25%", value: 20 },
      { label: "50%", value: 15 },
      { label: "75%", value: 10 },
      { label: "All of them", value: 5 },
      { label: "Not applicable", value: 0 },
    ]},
    8: { category: "Housing", text: "What kind of house do you live in?", options: [
      { label: "Detached", value: 25 },
      { label: "Semi detached", value: 20 },
      { label: "Terrace", value: 15 },
      { label: "Flat", value: 10 },
    ]},
    9: { category: "Housing", text: "How many bedrooms does your house have?", options: [
      { label: "1", value: 5 },
      { label: "2", value: 10 },
      { label: "3", value: 15 },
      { label: "4 or more", value: 20 },
    ]},
    10: { category: "Housing", text: "How many people (aged 17+) live in your house?", options: [
      { label: "1", value: 20 },
      { label: "2", value: 15 },
      { label: "3", value: 10 },
      { label: "4", value: 8 },
      { label: "5 or more", value: 5 },
    ]},
    11: { category: "Housing", text: "How do you heat your home?", options: [
      { label: "Gas", value: 20 },
      { label: "Oil", value: 25 },
      { label: "Electricity", value: 15 },
      { label: "Wood", value: 10 },
      { label: "Heatpump", value: 5 },
    ]},
    12: { category: "Housing", text: "Is your electricity on a green tariff?", options: [
      { label: "I don’t know", value: 15 },
      { label: "No", value: 20 },
      { label: "Yes but less than 100% renewables", value: 10 },
      { label: "Yes 100%", value: 5 },
    ]},
    13: { category: "Housing", text: "Which energy efficiency improvements are installed?", options: [
      { label: "Energy saving lightbulbs", value: -2 },
      { label: "Loft insulation", value: -3 },
      { label: "Wall insulation", value: -3 },
      { label: "Condensing boiler", value: -2 },
      { label: "Double glazing", value: -2 },
      { label: "Low flow fittings", value: -1 },
      { label: "Solar panels", value: -5 },
      { label: "Solar water heater", value: -4 },
    ]},
  };

  function selectOption(value) {
    setAnswers({ ...answers, [step]: value });
  }

  function calculate() {
    let total = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const finalResult = total.toFixed(2);

    let points = 0;
    if (finalResult <= 60) points = 5;
    else if (finalResult <= 100) points = 4;
    else if (finalResult <= 120) points = 3;
    else if (finalResult <= 150) points = 2;
    else points = 1;

    fetch("http://localhost:5000/api/saveResult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ footprint: finalResult, user_id: userId, ecoPoints: points })
    })
      .then(res => res.text())
      .then(data => console.log("Backend response:", data))
      .catch(err => console.error("Error saving result:", err));

    // ✅ Show result instead of questions
    setResult(finalResult);
    setEcoPoints(points);
  }

  return (
    <div className="calculator-container">
      <div className="calculator-box">
        <h2>🌍 EcoAware Footprint Calculator</h2>

        {/* ✅ Show questions only if result is not calculated */}
        {!result && questions[step] && (
          <div className="question-card">
            <h3>{questions[step].category} Q{step}</h3>
            <p>{questions[step].text}</p>
            <div className="options">
              {questions[step].options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`option-btn ${answers[step] === opt.value ? "selected" : ""}`}
                  onClick={() => selectOption(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Navigation only if result not shown */}
        {!result && (
          <div className="navigation">
            {step > 1 && (
              <button className="nav-btn" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < Object.keys(questions).length && (
              <button className="nav-btn" onClick={() => setStep(step + 1)}>
                Next
              </button>
            )}
            {step === Object.keys(questions).length && (
              <button className="calculate-btn" onClick={calculate}>
                Calculate
              </button>
            )}
          </div>
        )}

        {/* ✅ Show result box only after calculation */}
        {result && (
          <div className="result-box">
            <h3>Your Environmental Footprint: {result} kg CO₂</h3>
            <h3>You earned: {ecoPoints} EcoPoints 🌱</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
