import React from "react";
import "../App.css";

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="heading">Dashboard</h2>
      <p className="normal-text" style={{ marginTop: "10px" }}>
        This will show progress, recently practised signs and basic stats for the user 
        (we can use localStorage, no heavy auth needed).
      </p>
    </div>
  );
};

export default Dashboard;
