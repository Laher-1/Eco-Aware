import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Example: fetch logged-in user from backend session
  useEffect(() => {
    fetch("http://localhost:5000/api/current-user", {
      credentials: "include" // ensures cookies are sent
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.user_id) {
          setUser(data);
        }
      })
      .catch(err => console.error("❌ Error fetching current user:", err));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
