import React, { useState, useEffect } from "react";

function App() {
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API URL (Replace with your actual AWS API Gateway endpoint)
    const API_URL =
      "https://h5rvy1rkdd.execute-api.us-east-2.amazonaws.com/MODLL_GetGameData?game_id=12345&date=2025-03-18";

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setGameData(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MODLL Game Data</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {gameData ? (
        <div>
          <h2>Game ID: {gameData.game_id}</h2>
          <p>
            <strong>Date:</strong> {gameData.date}
          </p>
          <p>
            <strong>Team 1:</strong> {gameData.team_1} vs{" "}
            <strong>Team 2:</strong> {gameData.team_2}
          </p>
          <p>
            <strong>MODLL Prediction:</strong> {gameData.modll_prediction}
          </p>
          <p>
            <strong>Vegas Line:</strong> {gameData.vegas_line}
          </p>
        </div>
      ) : (
        <p>Loading game data...</p>
      )}
    </div>
  );
}

export default App;
