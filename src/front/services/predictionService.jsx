export const predictionService = {
  async submit({ fixtureId, homeGoals, awayGoals }) {
    
    // Inyectamos la URL de tu backend de Flask
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    
    const response = await fetch(`${backendUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        predictions: [{ fixture_id: fixtureId, home_goals: homeGoals, away_goals: awayGoals }]
      })
    });
    
    if (!response.ok) throw new Error('Falló al enviar la predicción al backend');
    return true;
  }
};