import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const Dashboard = ({ onLogout }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/dashboard`, {
          withCredentials: true,
        });
        setMessage(res.data.message);
      } catch {
        if (onLogout) onLogout(); // session expired
      }
    };
    fetchDashboard();
  }, [onLogout]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
      if (onLogout) onLogout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="dashboard-card">
          <h2>Dashboard</h2>
          <p>{message || "Loading..."}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
