export const predictionService = {
  async submit({ fixtureId, homeGoals, awayGoals }) {
    
    // 🔥 1. Obtenemos el Token JWT que guardamos en el login
    const token = localStorage.getItem('token');
    
    // Si no hay token, rechazamos la petición inmediatamente
    if (!token) {
        throw new Error('Debes iniciar sesión para poder predecir');
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    
    const response = await fetch(`${backendUrl}/api/predictions`, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🔥 2. Inyectamos el pasaporte de seguridad
      },
      body: JSON.stringify({
        predictions: [{ fixture_id: fixtureId, home_goals: homeGoals, away_goals: awayGoals }]
      })
    });
    
    if (!response.ok) throw new Error('Falló al enviar la predicción al backend');
    return true;
  }
};