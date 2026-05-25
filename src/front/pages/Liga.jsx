import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Liga = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const liga = searchParams.get("liga") || "PD";
  const temp = searchParams.get("temporada") || "2024-2025";
  
  const [partidos, setPartidos] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = `https://literate-memory-97r4gq5rwqxjhx7g4-3001.app.github.dev/api/fixtures/historico?liga=${liga}&temporada=${temp}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => { 
        setPartidos(data); 
        if (data && data.length > 0) {
          const primeraJornada = data[0].jornada ? data[0].jornada.toString() : "1";
          setSelectedJornada(primeraJornada);
        }
        setLoading(false); 
      })
      .catch(err => { console.error("Error:", err); setLoading(false); });
  }, [liga, temp]);

  const jornadasDisponibles = [...new Set(partidos.map(p => p.jornada))].sort((a, b) => a - b);
  const partidosFiltrados = partidos.filter(p => p.jornada?.toString() === selectedJornada);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>KickHub</h1>
      
      <div style={styles.nav}>
        {["PD", "PL", "SA", "BL"].map(l => (
          <button key={l} onClick={() => setSearchParams({liga: l, temporada: temp})} style={styles.tab(liga === l)}>{l}</button>
        ))}
      </div>

      <div style={styles.selectors}>
        <select value={temp} onChange={(e) => setSearchParams({liga: liga, temporada: e.target.value})} style={styles.select}>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>
        <select value={selectedJornada} onChange={(e) => setSelectedJornada(e.target.value)} style={styles.select}>
          {jornadasDisponibles.map(j => <option key={j} value={j}>Jornada {j}</option>)}
        </select>
      </div>

      <div style={styles.list}>
        {loading ? <p style={{color: '#fff', textAlign: 'center'}}>Cargando...</p> : (
          partidosFiltrados.length > 0 ? partidosFiltrados.map(m => (
            <div key={m.id} style={styles.card}>
              <div style={styles.matchHeader}>
                <span style={styles.team}>{m.homeTeam?.name}</span>
                <span style={styles.score}>{m.score?.fullTime?.home ?? "-"} - {m.score?.fullTime?.away ?? "-"}</span>
                <span style={styles.team}>{m.awayTeam?.name}</span>
              </div>
              {m.eventos && m.eventos.length > 0 && (
                <div style={styles.eventContainer}>
                  {m.eventos.map((e, index) => (
                    <div key={index} style={styles.eventItem}>
                      <span style={styles.min}>{e.minuto}</span>
                      <span style={e.tipo === 'gol' ? styles.gol : styles.tarjeta}>
                        {e.tipo === 'gol' ? '⚽' : '🟨'} {e.jugador}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )) : <p style={{color: '#fff', textAlign: 'center'}}>No hay eventos registrados.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "40px 20px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif", backgroundColor: "#26753c", minHeight: "100vh" },
  title: { color: "#fff", textAlign: "center", marginBottom: "20px" },
  nav: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" },
  tab: (active) => ({ padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: active ? "#fff" : "rgba(255,255,255,0.2)", color: active ? "#26753c" : "#fff", fontWeight: "bold" }),
  selectors: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" },
  select: { padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#fff", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  matchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" },
  team: { flex: 1, textAlign: "center" },
  score: { fontSize: "1.5rem", color: "#26753c", margin: "0 15px", minWidth: "60px", textAlign: "center" },
  eventContainer: { marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "10px" },
  eventItem: { display: "flex", gap: "10px", marginBottom: "5px", fontSize: "0.9rem" },
  min: { fontWeight: "bold", color: "#666" },
  gol: { color: "#26753c", fontWeight: "600" },
  tarjeta: { color: "#d97706", fontWeight: "600" }
};