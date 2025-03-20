import React, { useState } from "react";

const App = () => {
  const [userQuery, setUserQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGameAnalysis = async () => {
    setLoading(true);
    setResponse(null);

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    console.log("🔍 API Key in App:", apiKey); // 🔍 Debugging line to check API key

    if (!apiKey) {
      console.error("❌ OpenAI API key is missing.");
      setResponse("Error: Missing API key. Make sure it is set in Vercel.");
      setLoading(false);
      return;
    }

    try {
      const prompt = `
      You are a sophisticated betting assistant for college basketball games. 
      When a user asks about good bets for an upcoming match, you will:
      - Search for and analyze the recent statistics for both teams involved.
      - Utilize the MODLL, evaluate player performance, team form, head-to-head records, where the game is being played, and any other relevant factors.
      - Generate three categories of betting options:
        1️⃣ **Very Likely (Low Winnings)**: Provide 2-3 high-probability bets with lower odds.
        2️⃣ **Likely (Middle Odds)**: Suggest 2-3 moderately risky bets with balanced odds.
        3️⃣ **Possible (High Winnings)**: Offer 2-3 riskier bets with higher potential payouts.
      - For each category, include a mix of the following bet types:
        ✅ Game result (win, lose)  
        ✅ Player statistics (points, assists, rebounds, blocks)  

      **Ensure all analyses are presented in a structured, easy-to-read format.**  

      ### **All future betting analyses must include:**
      ✅ MODLL’s **predicted outcome** vs. **Vegas odds** (highlight discrepancies).  
      ✅ **Three categories of bets** (Very Likely, Likely, Possible).  
      ✅ **Confidence ranking (1-10)** for each bet based on MODLL insights.  
      ✅ **Sharp money movement insights** (any key line shifts or betting trends).  
      ✅ **MODLL’s highest variance bets** (where the model sees the biggest edge).  
      ✅ **Trap lines & public betting bias** (flag any games where the market is overinflated).  
      ✅ **Expected Value (EV) calculations** to quantify the value of bets.  
      ✅ **Late-breaking news adjustments** (injuries, suspensions, coaching changes).  
      ✅ **The MODLL’s best bet recommendation for the game.**  

      **Use the most current data available** to ensure accuracy.
      Always include **sources for your analysis** (betting odds, team stats, player performance, matchup insights).
      
      ---
      
      **User Query:** "${userQuery}"
      `;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4", // Use "gpt-3.5-turbo" if GPT-4 is unavailable
          messages: [{ role: "system", content: prompt }],
          max_tokens: 1200, // Adjust token limit as needed
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ OpenAI Response:", data); // Debugging log
      setResponse(data.choices[0]?.message?.content || "No response from AI");
    } catch (error) {
      console.error("❌ Error fetching game analysis:", error);
      setResponse(`Error fetching game analysis: ${error.message}`);
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
      {loading && <p>Loading game data...</p>}
      {response && <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px", fontSize: "16px" }}>{response}</pre>}
    </div>
  );
};

export default App;
