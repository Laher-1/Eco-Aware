import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/quiz');
      setQuestions(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setMessage('Error fetching questions');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const handleRemoveOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    // Reset answer if the removed option was selected
    let newAnswer = formData.answer;
    if (formData.answer === formData.options[index]) {
      newAnswer = '';
    }
    setFormData({ ...formData, options: newOptions, answer: newAnswer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      setMessage('Please enter a question');
      setMessageType('error');
      return;
    }

    if (formData.options.length < 2) {
      setMessage('Please add at least 2 options');
      setMessageType('error');
      return;
    }

    if (formData.options.some(opt => !opt.trim())) {
      setMessage('Please fill in all options');
      setMessageType('error');
      return;
    }

    if (!formData.answer || !formData.options.includes(formData.answer)) {
      setMessage('Please select a valid answer from the options');
      setMessageType('error');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/quiz/${editingId}`, formData);
        setMessage('✅ Question updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/quiz', formData);
        setMessage('✅ Question added successfully!');
      }
      setMessageType('success');
      setFormData({ question: '', options: ['', '', '', ''], answer: '' });
      setEditingId(null);
      setShowForm(false);
      fetchQuestions();
    } catch (err) {
      console.error('Error saving question:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error saving question';
      setMessage(`❌ ${errorMsg}`);
      setMessageType('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/quiz/${id}`);
      setMessage('✅ Question deleted successfully!');
      setMessageType('success');
      fetchQuestions();
    } catch (err) {
      setMessage('❌ Error deleting question');
      setMessageType('error');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ question: '', options: ['', '', '', ''], answer: '' });
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ color: "#2e7d32" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5em", color: "#1b5e20", marginBottom: "10px" }}>❓ Manage Quiz Questions</h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>Create, edit, and delete sustainability quiz questions</p>
      </div>

      {/* Action Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "14px 30px",
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1em",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "30px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#1b5e20"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#2e7d32"}
        >
          + Add New Question
        </button>
      )}

      {/* Form Section */}
      {showForm && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "40px"
        }}>
          <h2 style={{ color: "#2e7d32", marginTop: "0" }}>
            {editingId ? "✏️ Edit Question" : "➕ Add New Question"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
                Question *
              </label>
              <input
                type="text"
                name="question"
                placeholder="Enter the quiz question"
                value={formData.question}
                onChange={handleInputChange}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
                  Options * ({formData.options.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#2e7d32",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "0.95em",
                    transition: "background-color 0.3s"
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = "#1b5e20"}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = "#2e7d32"}
                >
                  + Add Option
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                {formData.options.map((option, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "1em",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box"
                      }}
                      onFocus={e => e.target.style.borderColor = "#2e7d32"}
                      onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        style={{
                          padding: "10px 16px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.95em",
                          transition: "background-color 0.3s",
                          whiteSpace: "nowrap"
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#d32f2f"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#f44336"}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333", fontSize: "1.1em" }}>
                Correct Answer *
              </label>
              <select
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "1em",
                  cursor: "pointer"
                }}
              >
                <option value="">Select the correct answer</option>
                {formData.options.map((option, idx) => (
                  option && <option key={idx} value={option}>{option}</option>
                ))}
              </select>
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

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "14px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1em",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = "#1b5e20"}
                onMouseOut={e => e.currentTarget.style.backgroundColor = "#2e7d32"}
              >
                {editingId ? "Update Question" : "Add Question"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: "14px",
                  backgroundColor: "#999",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1em",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = "#777"}
                onMouseOut={e => e.currentTarget.style.backgroundColor = "#999"}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List Section */}
      <div>
        <h2 style={{ fontSize: "1.8em", color: "#2e7d32", marginBottom: "20px" }}>📋 Questions ({questions.length})</h2>
        {questions.length === 0 ? (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            color: "#999"
          }}>
            <p style={{ fontSize: "1.2em" }}>No questions yet. Create your first one!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            {questions.map((q) => (
              <div key={q.id} style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderTop: "4px solid #2e7d32"
              }}>
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ color: "#666", fontSize: "0.9em", margin: "0 0 8px 0" }}>Question #{q.id}</p>
                  <h3 style={{ color: "#333", margin: "0", fontSize: "1.1em" }}>{q.question}</h3>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <p style={{ color: "#666", fontSize: "0.9em", marginBottom: "8px" }}>Options:</p>
                  <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                    {q.options.map((opt, idx) => (
                      <li key={idx} style={{
                        padding: "6px 0",
                        color: opt === q.answer ? "#2e7d32" : "#666",
                        fontWeight: opt === q.answer ? "600" : "400"
                      }}>
                        {opt === q.answer ? "✓ " : "• "} {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleDelete(q.id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background-color 0.3s"
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#d32f2f"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#f44336"}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuiz;
