import React, { useState } from "react";

const App = () => {
  const [userQuery, setUserQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Updated fetchGameAnalysis to include full MODLL insights
  const fetchGameAnalysis = async () => {
    if (loading) return;

    setLoading(true);
    setResponse(null);

    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) throw new Error("Missing API Key");

      const prompt = `
        You are The MODLL, a sophisticated betting assistant for college basketball games.
        A user has asked: "${userQuery}" 
        Provide a **detailed** betting analysis that includes:

        ✅ MODLL’s predicted outcome vs. Vegas odds.
        ✅ Three categories of bets (Very Likely, Likely, Possible).
        ✅ Confidence ranking (1-10) for each bet.
        ✅ Sharp money movement insights.
        ✅ MODLL’s highest variance bets.
        ✅ Any trap lines or public betting bias.
        ✅ Expected Value (EV) calculations.
        ✅ Any last-minute news adjustments.
        ✅ The MODLL’s **best bet recommendation**.

        Use **up-to-date team stats, player performance, and historical trends** to support your picks.
        Format the response with clear sections using Markdown-style headers (e.g., **Bold Titles**).
      `;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",  // ✅ Using GPT-3.5-Turbo to ensure availability
          messages: [{ role: "system", content: prompt }],
          max_tokens: 1000,  // ✅ Increased response size
        }),
      });

      if (response.status === 429) {
        setResponse("⚠️ OpenAI rate limit reached. Please try again later.");
        return;
      }

      const data = await response.json();
      setResponse(data.choices?.[0]?.message?.content || "No response from AI");
    } catch (error) {
      setResponse("❌ Error fetching game analysis.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>MODLL Betting Analysis</h1>
      <p>Ask for a breakdown of any college basketball game:</p>
      <textarea
        placeholder="Example: 'Give me an analysis of Duke vs Kentucky on March 20th.'"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        style={{ width: "100%", height: "100px", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button 
        onClick={fetchGameAnalysis} 
        style={{ padding: "10px 20px", fontSize: "16px", marginTop: "10px" }}
      >
        Get Betting Analysis
      </button>
      {loading && <p>⏳ Loading game data...</p>}
      {response && <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px", fontSize: "16px" }}>{response}</pre>}
    </div>
  );
};

export default App;