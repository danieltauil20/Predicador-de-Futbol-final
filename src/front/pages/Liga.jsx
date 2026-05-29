import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// 1. IMPORTACIÓN DE TODOS TUS CSVs (Asegúrate de que los nombres coincidan con tus archivos reales)
import csvEspana from "../../../data/ESPAÑA-2024-2025.csv?raw";
import csvInglaterra from "../../../data/INGLATERRA-2024-2025.csv?raw";
import csvItalia from "../../../data/ITALIA-2024-2025.csv?raw";
import csvAlemania from "../../../data/ALEMANIA-2024-2025.csv?raw";

// Diccionario que asocia el nombre de la pestaña con su respectivo archivo CSV
const CSV_POR_LIGA = {
  "La Liga": csvEspana,
  "Premier League": csvInglaterra,
  "Serie A": csvItalia,
  "Bundesliga": csvAlemania
};

// Diccionario de Escudos (De momento solo con los de España, luego lo haremos crecer juntos)
const MAPPING_EQUIPOS = {
  // --- ESPAÑA ---
  "Ath Bilbao": "athletic-club", "Betis": "real-betis", "Celta": "celta-vigo", "Las Palmas": "las-palmas", "Leganes": "leganes", "Barcelona": "barcelona", "Vallecano": "rayo-vallecano", "Sociedad": "real-sociedad", "Valladolid": "valladolid", "Espanol": "espanol", "Español": "espanol", "Real Madrid": "real-madrid", "Ath Madrid": "atletico-madrid", "Villarreal": "villarreal", "Sevilla": "sevilla", "Valencia": "valencia", "Girona": "girona", "Getafe": "getafe", "Mallorca": "mallorca", "Osasuna": "osasuna", "Alaves": "alaves",
  // --- INGLATERRA (Premier League) ---
  "Arsenal": "arsenal", "Aston Villa": "aston-villa", "Bournemouth": "bournemouth", "Brentford": "brentford", "Brighton": "brighton", "Chelsea": "chelsea", "Crystal Palace": "crystal-palace", "Everton": "everton", "Fulham": "fulham", "Ipswich": "ipswich", "Leicester": "leicester", "Liverpool": "liverpool", "Man City": "manchester-city", "Man United": "manchester-united", "Newcastle": "newcastle", "Forest": "nottingham-forest", "Southampton": "southampton", "Tottenham": "tottenham", "West Ham": "west-ham", "Wolves": "wolves",
  // --- ITALIA (Serie A) ---
  "Atalanta": "atalanta", "Bologna": "bologna", "Cagliari": "cagliari", "Como": "como", "Empoli": "empoli", "Fiorentina": "fiorentina", "Genoa": "genoa", "Inter": "inter-milan", "Juventus": "juventus", "Lazio": "lazio", "Lecce": "lecce", "Milan": "ac-milan", "Monza": "monza", "Napoli": "napoli", "Parma": "parma", "Roma": "as-roma", "Torino": "torino", "Udinese": "udinese", "Venezia": "venezia", "Verona": "hellas-verona",
  // --- ALEMANIA (Bundesliga) ---
  "Augsburg": "augsburg", "Leverkusen": "bayer-leverkusen", "Bayern Munich": "bayern-munich", "Bochum": "bochum", "Dortmund": "borussia-dortmund", "M'gladbach": "borussia-monchengladbach", "Eintracht Frankfurt": "eintracht-frankfurt", "Freiburg": "freiburg", "Heidenheim": "heidenheim", "Hoffenheim": "hoffenheim", "Holstein Kiel": "holstein-kiel", "RB Leipzig": "rb-leipzig", "Mainz": "mainz", "St Pauli": "st-pauli", "Stuttgart": "stuttgart", "Werder Bremen": "werder-bremen", "Wolfsburg": "wolfsburg", "Union Berlin": "union-berlin", "Nott'm Forest": "nottingham-forest", "Holstein Kiel": "holstein-kiel", "Bochum": "bochum", "Ein Frankfurt": "eintracht-frankfurt",
};

export const Liga = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const liga = searchParams.get("liga") || "La Liga";
  const jornadaActiva = searchParams.get("jornada") || "1";

  const [partidosPorJornada, setPartidosPorJornada] = useState({});
  const [listaJornadas, setListaJornadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLogoPath = (nombreEquipo) => {
    if (!nombreEquipo) return null;
    const nombreArchivo = MAPPING_EQUIPOS[nombreEquipo.trim()];
    return nombreArchivo ? `/logos/${nombreArchivo}.png` : null;
  };

  // Este useEffect se ejecutará CADA VEZ que el usuario cambie de pestaña (liga)
  useEffect(() => {
    try {
      setLoading(true);

      // Seleccionamos el CSV dinámicamente según la liga activa
      const datosCsvActivos = CSV_POR_LIGA[liga];

      if (!datosCsvActivos) {
        throw new Error(`No se encontró el archivo CSV para la liga: ${liga}`);
      }

      const lineas = datosCsvActivos.split(/\r?\n/);
      const resultadoAgrupado = {};
      let contadorPartidosValidos = 0;

      // El número de partidos por jornada varía: España/Inglaterra/Italia tienen 10, Alemania tiene 9 (18 equipos)
      const partidosPorJornadaConfig = liga === "Bundesliga" ? 9 : 10;

      for (let i = 1; i < lineas.length; i++) {
        const linea = lineas[i].trim();
        if (!linea) continue;
        const columnas = linea.split(",");
        const equipoLocal = columnas[3]?.trim();
        const equipoVisitante = columnas[4]?.trim();
        const golesLocal = columnas[5]?.trim();
        const golesVisitante = columnas[6]?.trim();

        if (!equipoLocal || !equipoVisitante) continue;

        // Cálculo matemático adaptativo según la liga
        const numJornada = String(Math.floor(contadorPartidosValidos / partidosPorJornadaConfig) + 1);
        contadorPartidosValidos++;

        if (!resultadoAgrupado[numJornada]) resultadoAgrupado[numJornada] = [];
        resultadoAgrupado[numJornada].push({
          id: `match-${liga}-${i}`, home: equipoLocal, away: equipoVisitante, scoreHome: golesLocal !== "" && golesLocal !== undefined ? golesLocal : "-", scoreAway: golesVisitante !== "" && golesVisitante !== undefined ? golesVisitante : "-"
        });
      }

      setPartidosPorJornada(resultadoAgrupado);
      const jornadasOrdenadas = Object.keys(resultadoAgrupado).sort((a, b) => Number(a) - Number(b));
      setListaJornadas(jornadasOrdenadas);
      setLoading(false);
    } catch (error) {
      console.error("Error procesando el CSV de la liga:", error);
      setPartidosPorJornada({});
      setListaJornadas([]);
      setLoading(false);
    }
  }, [liga]); // <--- Clave: se reactiva al cambiar de liga

  const partidosFiltrados = partidosPorJornada[jornadaActiva] || [];
  const handleJornadaChange = (e) => setSearchParams({ liga: liga, jornada: e.target.value });

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <h1 style={styles.title}>KickHub</h1>

      <div style={styles.nav}>
        {["La Liga", "Premier League", "Serie A", "Bundesliga"].map(l => (
          <button key={l} onClick={() => setSearchParams({ liga: l, jornada: "1" })} style={styles.tab(liga === l)}>
            {l}
          </button>
        ))}
      </div>

      {!loading && listaJornadas.length > 0 && (
        <div style={styles.filterContainer}>
          <label style={styles.label} htmlFor="select-jornada">Seleccionar Jornada: </label>
          <select id="select-jornada" value={jornadaActiva} onChange={handleJornadaChange} style={styles.select}>
            {listaJornadas.map(numJornada => <option key={numJornada} value={numJornada}>Jornada {numJornada}</option>)}
          </select>
        </div>
      )}

      <div style={styles.list}>
        {loading ? (
          <p style={{ color: "#FFFFFF", textAlign: "center", fontFamily: "Poppins" }}>Cargando calendario...</p>
        ) : partidosFiltrados.length === 0 ? (
          <p style={{ color: "#BFC3CA", textAlign: "center", fontFamily: "Poppins" }}>No hay partidos cargados para la Jornada {jornadaActiva}.</p>
        ) : (
          partidosFiltrados.map(m => (
            <div key={m.id} style={styles.card}>
              <div style={styles.matchHeader}>
                <div style={styles.teamContainerLocal}>
                  <span style={styles.team}>{m.home}</span>
                  <img src={getLogoPath(m.home) || ""} alt="" style={styles.logo} onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 24 24' fill='none' stroke='%23BFC3CA' stroke-width='2'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path></svg>"; }} />
                </div>
                <span style={styles.score}>{m.scoreHome} - {m.scoreAway}</span>
                <div style={styles.teamContainerVisitante}>
                  <img src={getLogoPath(m.away) || ""} alt="" style={styles.logo} onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='55' height='55' viewBox='0 0 24 24' fill='none' stroke='%23BFC3CA' stroke-width='2'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path></svg>"; }} />
                  <span style={styles.team}>{m.away}</span>
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
  container: { padding: "40px 20px", maxWidth: "650px", margin: "0 auto", fontFamily: "'Poppins', sans-serif", backgroundColor: "#26753c", minHeight: "100vh" },
  title: { color: "#FFFFFF", textAlign: "center", marginBottom: "25px", fontWeight: "700", fontSize: "2.2rem" },
  nav: { display: "flex", justifyContent: "center", gap: "28px", marginBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" },
  tab: (active) => ({ padding: "12px 20px", border: "none", borderBottom: active ? "3px solid #0EE7AC" : "3px solid transparent", cursor: "pointer", backgroundColor: "transparent", color: active ? "#FFFFFF" : "#BFC3CA", fontWeight: active ? "600" : "400", fontSize: "1rem", fontFamily: "'Poppins', sans-serif", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "44px" }),
  filterContainer: { display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "30px", color: "#FFFFFF", fontWeight: "500", fontFamily: "'Poppins', sans-serif" },
  label: { fontSize: "1rem" },
  select: { padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#1E293B", color: "#FFFFFF", fontWeight: "500", cursor: "pointer", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { backgroundColor: "#1E293B", padding: "18px 24px", borderRadius: "14px", border: "none", boxShadow: "0px 4px 12px rgba(0,0,0,0.15)", transition: "transform 0.2s ease" },
  matchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  teamContainerLocal: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px", flex: "1 1 0%", textAlign: "right" },
  teamContainerVisitante: { display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "16px", flex: "1 1 0%", textAlign: "left" },
  team: { fontSize: "1.1rem", color: "#FFFFFF", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  score: { fontSize: "1.4rem", color: "#0F172A", padding: "6px 20px", minWidth: "85px", textAlign: "center", fontWeight: "700", backgroundColor: "#0EE7AC", borderRadius: "20px", boxShadow: "0px 2px 8px rgba(14,231,172,0.4)", fontFamily: "'Poppins', sans-serif" },
  logo: { width: "55px", height: "55px", objectFit: "contain", backgroundColor: "transparent", padding: "0px" },
};