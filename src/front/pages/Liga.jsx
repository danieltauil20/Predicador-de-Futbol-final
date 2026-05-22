import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Liga = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ligaURL = searchParams.get("liga") || "PD";
  
  const [partidosFiltrados, setPartidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const infoLigas = {
    "PL": { nombre: "Inglesa", desc: "Premier League" },
    "BL": { nombre: "Alemana", desc: "Bundesliga" },
    "SA": { nombre: "Italiana", desc: "Serie A TIM" },
    "PD": { nombre: "Española", desc: "La Liga EA Sports" },
    "WC": { nombre: "Mundial 2026", desc: "FIFA World Cup" }
  };

  const consultarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:3001/api/fixtures/historico?liga=${ligaURL}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error("Error de conexión. Verifica el backend.");
      
      const data = await res.json();
      setPartidosFiltrados(data || []);
    } catch (err) { 
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    consultarDatos();
  }, [ligaURL]);

  const cambiarLiga = (idLiga) => {
    setSearchParams({ liga: idLiga });
  };

  return (
    <div className="live-score-wrapper">
      <style>{`
        .live-score-wrapper { font-family: 'Inter', Arial, sans-serif; background-color: #0f111a; min-height: 100vh; color: #b2bdcd; padding: 30px 20px; }
        .live-score-container { max-width: 900px; margin: 0 auto; background-color: #151824; border-radius: 12px; padding: 25px; box-shadow: 0 8px 16px rgba(0,0,0,0.4); }
        
        .header-title-area { margin-bottom: 25px; border-bottom: 2px solid #293047; padding-bottom: 15px; }
        .header-title-area h2 { color: #fff; margin: 0 0 5px 0; }
        .header-title-area p { color: #0ee7ac; margin: 0; font-size: 0.9rem; font-weight: 500; }
        
        .league-selector { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #1c2130; }
        .league-btn { background: #1a1e2d; color: #b2bdcd; border: 1px solid #293047; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s ease; }
        .league-btn:hover { border-color: #0ee7ac; color: #fff; transform: translateY(-2px); }
        .league-btn.active { background: #0ee7ac; color: #0f111a; border-color: #0ee7ac; box-shadow: 0 4px 10px rgba(14, 231, 172, 0.2); }

        .match-card { position: relative; border: 1px solid #1c2130; background-color: #1a1e2d; padding: 25px 20px; border-radius: 10px; margin-bottom: 18px; transition: all 0.25s ease; overflow: hidden; }
        .match-card:hover { border-color: #0ee7ac; transform: translateY(-3px); box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
        .match-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: #0ee7ac; transform: scaleX(0); transition: transform 0.25s ease; }
        .match-card:hover::after { transform: scaleX(1); }
        
        .season-badge { position: absolute; top: 10px; right: 20px; background: rgba(14, 231, 172, 0.1); color: #0ee7ac; font-size: 0.7rem; font-weight: bold; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(14, 231, 172, 0.2); }
        
        .teams-score-display { display: grid; grid-template-columns: 1fr 130px 1fr; align-items: center; text-align: center; margin-top: 5px; }
        .team-name { font-weight: 600; font-size: 1.15rem; color: #fff; letter-spacing: -0.3px; }
        
        .score-box { background: #0f111a; color: #0ee7ac; font-weight: 800; font-size: 1.7rem; padding: 10px 15px; border-radius: 8px; border: 1px solid #293047; letter-spacing: 3px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); text-shadow: 0 0 10px rgba(14, 231, 172, 0.5); }
        
        /* NUEVO: ESTILOS PARA GOLES Y AMONESTADOS */
        .match-events { margin-top: 20px; padding-top: 15px; border-top: 1px dashed #293047; }
        .events-title { color: #9bb0cb; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: bold; text-align: center; }
        .events-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .event-row { display: flex; align-items: center; gap: 8px; color: #b2bdcd; font-size: 0.9rem; background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 6px; }
        .event-time { font-weight: bold; color: #0ee7ac; min-width: 30px; }
        .event-icon { font-size: 1.1rem; }
        .event-player { font-weight: 500; color: #fff; }
        .event-team { opacity: 0.6; font-size: 0.75rem; }
        
        @media (max-width: 600px) { .events-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="live-score-container">
        
        <div className="league-selector">
          {Object.keys(infoLigas).map(id => (
            <button 
              key={id} 
              className={`league-btn ${ligaURL === id ? 'active' : ''}`}
              onClick={() => cambiarLiga(id)}
            >
              {infoLigas[id].nombre}
            </button>
          ))}
        </div>

        <div className="header-title-area">
          <h2>Resultados Históricos</h2>
          <p>{infoLigas[ligaURL]?.desc || "Competición"}</p>
        </div>
        
        {error && <div style={{ color: "#ff4d4d", padding: "15px", background: "rgba(255, 77, 77, 0.1)", borderRadius: "8px" }}>🚨 {error}</div>}
        {loading && <div style={{ color: "#0ee7ac", textAlign: "center", padding: "40px" }}>Cargando partidos y estadísticas...</div>}
        
        {!loading && !error && partidosFiltrados.length === 0 && (
          <p style={{textAlign: "center", color: "#9bb0cb", padding: "30px"}}>No hay partidos registrados para esta liga.</p>
        )}

        {!loading && !error && partidosFiltrados.map((m) => (
          <div key={m.id} className="match-card">
            <span className="season-badge">{m.temporada}</span>

            <div className="teams-score-display">
              <div className="team-name" style={{textAlign: 'right'}}>{m.homeTeam?.name || "Local"}</div>
              
              <div className="score-box">
                {m.score?.fullTime?.home ?? "-"} : {m.score?.fullTime?.away ?? "-"}
              </div>
              
              <div className="team-name" style={{textAlign: 'left'}}>{m.awayTeam?.name || "Visitante"}</div>
            </div>

            {/* SECCIÓN DE GOLES Y AMONESTADOS */}
            {m.events && m.events.length > 0 && (
              <div className="match-events">
                <div className="events-title">Momentos Clave</div>
                <div className="events-grid">
                  {m.events.map((ev, idx) => (
                    <div key={idx} className="event-row">
                      <span className="event-time">{ev.time?.elapsed}'</span>
                      <span className="event-icon">
                        {ev.type === 'Goal' ? '⚽' : ev.detail?.includes('Red') ? '🟥' : '🟨'}
                      </span>
                      <span className="event-player">{ev.player?.name}</span>
                      <span className="event-team">({ev.team?.name})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
};