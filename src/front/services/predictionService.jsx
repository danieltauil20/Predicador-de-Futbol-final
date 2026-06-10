export const predictionService = {
  async submit({ fixtureId, homeGoals, awayGoals, matchData }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const token = localStorage.getItem("token");

    const payload = {
      fixture_id: fixtureId,
      home_goals: homeGoals,
      away_goals: awayGoals,
      home_team_name: matchData?.teams?.home?.name || "Local",
      away_team_name: matchData?.teams?.away?.name || "Visitante",
      home_team_logo: matchData?.teams?.home?.logo || "",
      away_team_logo: matchData?.teams?.away?.logo || ""
    };

    const response = await fetch(`${backendUrl}/api/predictions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ predictions: [payload] })
    });
    
    if (!response.ok) throw new Error('Falló al enviar la predicción al backend');
    return true;
  },

  async getHistory() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const token = localStorage.getItem("token");

    if (!token) return [];

    try {
      const response = await fetch(`${backendUrl}/api/predictions/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};