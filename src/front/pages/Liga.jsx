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
    const url = `https://literate-memory-97r4gq5rwqxjhx7g4-3001.app.github.dev/api/fixtures/historico?liga=${encodeURIComponent(liga)}&temporada=${encodeURIComponent(temp)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // --- PONLO AQUÍ ---
          console.log("Estructura real del equipo:", data[0].homeTeam);
          // ------------------

          const dataConJornadas = data.map((partido, index) => ({
            ...partido,
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


  const partidosFiltrados = selectedJornada
    ? partidos.filter(p => p.jornada.toString() === selectedJornada)
    : partidos;

  const getLogoPath = (nombreEquipo) => {
    if (!nombreEquipo) return "";
    // Busca el logo oficial en Wikipedia (la fuente más grande de escudos)
    const encodedName = encodeURIComponent(nombreEquipo);
    return `https://en.wikipedia.org/wiki/${encodedName}#/media/File:FC_Barcelona_(crest).svg`; // Esto es un ejemplo, no es dinámico

    // MEJOR OPCIÓN: Usa este servicio de búsqueda de logos por nombre:
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreEquipo)}&background=0EE7AC&color=fff&size=128`;
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
            <div key={m.id} style={styles.card} onClick={() => setPartidoSeleccionado(m)}>
              <div style={styles.matchHeader}>
                <div style={styles.teamContainer}>
                  <img src={getLogoPath(m.homeTeam?.name)} alt="logo" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
                  <span style={styles.team}>{m.homeTeam?.name || "Local"}</span>
                </div>
                <span style={styles.score}>{m.score?.fullTime?.home ?? "-"} - {m.score?.fullTime?.away ?? "-"}</span>
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

  // TARJETAS NEÓN
  card: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #black",
    marginBottom: "10px",
    cursor: 'pointer'
  },

  matchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" },
  team: { flex: 1, textAlign: "center", fontSize: "0.95rem", color: "black" },
  score: { fontSize: "1.3rem", color: "black", margin: "0 15px", minWidth: "50px", textAlign: "center", fontWeight: "bold" },
  teamContainer: { display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" },
  logo: {
    width: "35px",
    height: "35px",
    objectFit: "contain",
    backgroundColor: "rgba(255,255,255,0.1)", // Fondo translúcido para ver si el contenedor existe
    borderRadius: "50%", // Un toque redondo queda mejor
    padding: "2px"
  },
};