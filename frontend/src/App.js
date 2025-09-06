import React, { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import axios from "axios";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const checkSession = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/auth/me", {
        withCredentials: true,
      });
      setLoggedIn(res.data.loggedIn);
      setUserEmail(res.data.email || "");
    } catch {
      setLoggedIn(false);
      setUserEmail("");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loggedIn) return <Dashboard onLogout={() => { setLoggedIn(false); setUserEmail(""); }} email={userEmail} />;

  return (
    <div className="App">
      <div className="app-container">
        <div className="forms-wrapper">
          <Register />
          <Login onLogin={checkSession} />
        </div>
      </div>
    </div>
  );
}

export default App;
