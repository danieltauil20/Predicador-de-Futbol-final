import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Liga = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const liga = searchParams.get("liga") || "La Liga";
  const temp = searchParams.get("temporada") || "2024-2025";

  const [partidos, setPartidos] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = `https://literate-memory-97r4gq5rwqxjhx7g4-3001.app.github.dev/api/fixtures/historico?liga=${encodeURIComponent(liga)}&temporada=${encodeURIComponent(temp)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const dataConJornadas = data.map((partido, index) => ({
            ...partido,
            jornada: Math.floor(index / 10) + 1
          }));
          setPartidos(dataConJornadas);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [liga, temp]);

  // Función para obtener ruta local (public/logos/nombre-equipo.png)
  // Reemplaza SOLO esta función dentro de tu componente Liga
  const getLogoPath = (nombreEquipo) => {
    if (!nombreEquipo) return "/logos/default.png";

    const nombreLimpio = nombreEquipo.toLowerCase().trim();

    // El diccionario que conecta la API con tus archivos
    const mapaEquipos = {
      "real madrid": "realmadrid",
      "barcelona": "barcelona",
      "fc barcelona": "barcelona",
      "atletico madrid": "atlmadrid",
      "atlético madrid": "atlmadrid",
      "atletico de madrid": "atlmadrid",
      "athletic club": "athletic",
      "athletic bilbao": "athletic",
      "real betis": "betis",
      "betis": "betis",
      "celta vigo": "celta",
      "celta de vigo": "celta",
      "espanyol": "espanyol",
      "getafe": "getafe",
      "girona": "girona",
      "girona fc": "girona",
      "mallorca": "mallorca",
      "rcd mallorca": "mallorca",
      "osasuna": "osasuna",
      "ca osasuna": "osasuna",
      "rayo vallecano": "rayovallecano",
      "real sociedad": "realsociedad",
      "sevilla": "sevilla",
      "sevilla fc": "sevilla",
      "valencia": "valencia",
      "valencia cf": "valencia",
      "villarreal": "villarreal",
      "alaves": "alaves",
      "alavés": "alaves",
      "deportivo alavés": "alaves",
      "elche": "elche",
      "levante": "levante",
      "real oviedo": "realoviedo"
    };

    const nombreArchivo = mapaEquipos[nombreLimpio];

    if (nombreArchivo) {
      return `/logos/${nombreArchivo}.png`;
    } else {
      console.warn(`🚨 Falta mapear el equipo: "${nombreEquipo}". Agrega "${nombreLimpio}" al diccionario.`);
      return "/logos/default.png";
    }
  };

  const partidosFiltrados = selectedJornada
    ? partidos.filter(p => p.jornada.toString() === selectedJornada)
    : partidos;

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

      <div style={styles.list}>
        {loading ? (
          <p style={{ color: '#fff', textAlign: 'center' }}>Cargando...</p>
        ) : (
          partidosFiltrados.map(m => (
            <div key={m.id} style={styles.card}>
              <div style={styles.matchHeader}>

                <div style={styles.teamContainer}>
                  <img src={getLogoPath(m.homeTeam?.name)} alt="local" style={styles.logo} onError={(e) => e.target.src = "/logos/default.png"} />
                  <span style={styles.team}>{m.homeTeam?.name}</span>
                </div>

                <span style={styles.score}>{m.score?.fullTime?.home ?? "-"} - {m.score?.fullTime?.away ?? "-"}</span>

                <div style={styles.teamContainer}>
                  <span style={styles.team}>{m.awayTeam?.name}</span>
                  <img src={getLogoPath(m.awayTeam?.name)} alt="visitante" style={styles.logo} onError={(e) => e.target.src = "/logos/default.png"} />
                </div>
              </div>
            </div>
          ))
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