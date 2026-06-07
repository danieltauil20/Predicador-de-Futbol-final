export const predictionService = {
  async submit({ fixtureId, homeGoals, awayGoals, matchData }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const token = localStorage.getItem("token"); // 🔥 1. Obtenemos tu Pasaporte JWT

    // 🔥 2. Extraemos los NOMBRES y LOGOS del partido para la Base de Datos
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
        'Authorization': `Bearer ${token}` // 🔥 3. Lo inyectamos para burlar el 401
      },
      body: JSON.stringify({ predictions: [payload] })
    });
    
    if (!response.ok) throw new Error('Falló al enviar la predicción al backend');
    return true;
  },

  // 🔥 4. NUEVA FUNCIÓN: Descargar tu historial al abrir la Quiniela
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