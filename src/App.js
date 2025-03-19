import React, { useState } from "react";

function App() {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameId, setGameId] = useState("");

  const fetchGameData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a sophisticated betting assistant for college basketball games. Provide an in-depth betting analysis for the given game ID.",
            },
            {
              role: "user",
              content: `Analyze the betting odds and predictions for Game ID: ${gameId}`,
            },
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        setGameData(data.choices[0].message.content);
      } else {
        setError("No data returned from OpenAI.");
      }
    } catch (err) {
      setError("Error fetching data. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MODLL Game Data</h1>
      <input
        type="text"
        placeholder="Enter Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
      />
      <button onClick={fetchGameData} disabled={loading}>
        {loading ? "Loading..." : "Get Analysis"}
      </button>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      {gameData && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
          <h2>Game Analysis:</h2>
          <p>{gameData}</p>
        </div>
      )}
    </div>
  );
}

export default App;