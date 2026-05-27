import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Liga = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const liga = searchParams.get("liga") || "La Liga";
  const temp = searchParams.get("temporada") || "2024-2025";

  const [partidos, setPartidos] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState("");
  const [loading, setLoading] = useState(true);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  useEffect(() => {
    setLoading(true);
    const ligaEncoded = encodeURIComponent(liga);
    const tempEncoded = encodeURIComponent(temp);

    const url = `https://literate-memory-97r4gq5rwqxjhx7g4-3001.app.github.dev/api/fixtures/historico?liga=${ligaEncoded}&temporada=${tempEncoded}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // FORZAMOS la asignación de jornada aquí:
          const dataConJornadas = data.map((partido, index) => ({
            ...partido,
            // Asignamos jornada de 1 a 38
            jornada: Math.floor(index / 10) + 1
          }));
          setPartidos(dataConJornadas);
        } else {
          setPartidos([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [liga, temp]);

  // Filtramos usando la propiedad 'jornada' que acabamos de inyectar
  const partidosFiltrados = selectedJornada
    ? partidos.filter(p => p.jornada.toString() === selectedJornada)
    : partidos;

  const getLogoPath = (nombreEquipo) => {
    if (!nombreEquipo) return "";
    const mapeo = { "real madrid": "real-madrid", "fc barcelona": "barcelona", "atlético de madrid": "atletico-madrid" };
    const nombreLimpio = mapeo[nombreEquipo.toLowerCase()] || nombreEquipo.toLowerCase().replace(/\s+/g, '-');
    return `https://images.fotmob.com/image_resources/logo/teamlogo/${nombreLimpio}.png`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>KickHub</h1>

      <div style={styles.nav}>
        {["La Liga", "Premier League", "Serie A", "Bundesliga"].map(l => (
          <button key={l} onClick={() => setSearchParams({ liga: l, temporada: temp })} style={styles.tab(liga === l)}>
            {l}
          </button>
        ))}
      </div>

      <div style={styles.selectors}>
        <select value={temp} onChange={(e) => setSearchParams({ liga: liga, temporada: e.target.value })} style={styles.select}>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>

        <select value={selectedJornada} onChange={(e) => setSelectedJornada(e.target.value)} style={styles.select}>
          <option value="">Todas las jornadas</option>
          {[...Array(38)].map((_, i) => (
            <option key={i + 1} value={i + 1}>Jornada {i + 1}</option>
          ))}
        </select>
      </div>

      <div style={styles.list}>
        {loading ? (
          <p style={{ color: '#fff', textAlign: 'center' }}>Cargando...</p>
        ) : partidosFiltrados.length > 0 ? (
          partidosFiltrados.map(m => (
            <div key={m.id} style={{ ...styles.card, cursor: 'pointer' }} onClick={() => setPartidoSeleccionado(m)}>
              <div style={styles.matchHeader}>
                {/* Nombre equipo local */}
                <div style={styles.teamContainer}>
                  <img src={getLogoPath(m.homeTeam?.name)} alt="logo" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
                  <span style={styles.team}>{m.homeTeam?.name || "Local"}</span>
                </div>

                {/* Marcador */}
                <span style={styles.score}>
                  {m.score?.fullTime?.home ?? "-"} - {m.score?.fullTime?.away ?? "-"}
                </span>

                {/* Nombre equipo visitante */}
                <div style={styles.teamContainer}>
                  <span style={styles.team}>{m.awayTeam?.name || "Visitante"}</span>
                  <img src={getLogoPath(m.awayTeam?.name)} alt="logo" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#fff', textAlign: 'center' }}>No hay partidos para esta selección.</p>
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
  card: {
    backgroundColor: "#333", // Gris oscuro elegante
    color: "#fff",           // Texto blanco
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #444" // Borde suave
  },
  matchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" },
  team: { flex: 1, textAlign: "center", fontSize: "0.9rem", color: "#fff" }, // Texto blanco
  score: { fontSize: "1.2rem", color: "#fff", margin: "0 15px", minWidth: "50px", textAlign: "center" }, // Texto blanco
  teamContainer: { display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" },
  logo: { width: "30px", height: "30px", objectFit: "contain" },
  team: { flex: 1, textAlign: "center", fontSize: "0.9rem" },
  score: { fontSize: "1.5rem", color: "#26753c", margin: "0 10px", minWidth: "50px", textAlign: "center" },
  teamContainer: { display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" },
  logo: { width: "30px", height: "30px", objectFit: "contain" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)" },
  modalContent: { backgroundColor: "#ffffff", padding: "0", borderRadius: "20px", width: "90%", maxWidth: "450px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" },
  modalHeader: { backgroundColor: "#26753c", color: "#fff", padding: "20px", textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" },
  modalBody: { padding: "20px" },
  eventLine: { display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" },
  closeButton: { width: "100%", marginTop: "20px", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#26753c", color: "#fff", cursor: "pointer", fontWeight: "bold" }
};