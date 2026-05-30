import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// IMPORTACIÓN DE TODOS TUS CSVs
import ale24 from "../../../data/ALEMANIA-2024-2025.csv?raw";
import ale25 from "../../../data/ALEMANIA-2025-2026.csv?raw";
import esp24 from "../../../data/ESPAÑA-2024-2025.csv?raw";
import esp25 from "../../../data/ESPAÑA-2025-2026.csv?raw";
import ing24 from "../../../data/INGLATERRA-2024-2025.csv?raw";
import ing25 from "../../../data/INGLATERRA-2025-2026.csv?raw";
import ita24 from "../../../data/ITALIA-2024-2025.csv?raw";
import ita25 from "../../../data/ITALIA-2025-2026.csv?raw";

const DATA = {
  "Alemania": { "2024-2025": ale24, "2025-2026": ale25 },
  "España": { "2024-2025": esp24, "2025-2026": esp25 },
  "Inglaterra": { "2024-2025": ing24, "2025-2026": ing25 },
  "Italia": { "2024-2025": ita24, "2025-2026": ita25 }
};

const MAPPING_EQUIPOS = {
  "Ath Bilbao": "athletic-club", "Betis": "real-betis", "Celta": "celta-vigo", "Las Palmas": "las-palmas", "Leganes": "leganes", "Barcelona": "barcelona", "Vallecano": "rayo-vallecano", "Sociedad": "real-sociedad", "Valladolid": "valladolid", "Espanol": "espanol", "Real Madrid": "real-madrid", "Ath Madrid": "atletico-madrid", "Villarreal": "villarreal", "Sevilla": "sevilla", "Valencia": "valencia", "Girona": "girona", "Getafe": "getafe", "Mallorca": "mallorca", "Osasuna": "osasuna", "Alaves": "alaves", "Oviedo": "real-oviedo", "Levante": "levante", "Elche": "elche",
  "Arsenal": "arsenal", "Aston Villa": "aston-villa", "Bournemouth": "bournemouth", "Brentford": "brentford", "Brighton": "brighton", "Chelsea": "chelsea", "Crystal Palace": "crystal-palace", "Everton": "everton", "Fulham": "fulham", "Ipswich": "ipswich", "Leicester": "leicester", "Liverpool": "liverpool", "Man City": "manchester-city", "Man United": "manchester-united", "Newcastle": "newcastle", "Nott'm Forest": "nottingham-forest", "Southampton": "southampton", "Tottenham": "tottenham", "West Ham": "west-ham", "Wolves": "wolves", "Sunderland" : "sunderland", "Burnley" : "burnley", "Leeds" : "leeds",
  "Atalanta": "atalanta", "Bologna": "bologna", "Cagliari": "cagliari", "Como": "como", "Empoli": "empoli", "Fiorentina": "fiorentina", "Genoa": "genoa", "Inter": "inter-milan", "Juventus": "juventus", "Lazio": "lazio", "Lecce": "lecce", "Milan": "ac-milan", "Monza": "monza", "Napoli": "napoli", "Parma": "parma", "Roma": "as-roma", "Torino": "torino", "Udinese": "udinese", "Venezia": "venezia", "Verona": "hellas-verona", "Sassuolo" : "sassuolo", "Napoli" : "napoli", "Cremonese" : "cremonese", "Pisa" : "pisa",
  "Augsburg": "augsburg", "Leverkusen": "bayer-leverkusen", "Bayern Munich": "bayern-munich", "Bochum": "bochum", "Dortmund": "borussia-dortmund", "M'gladbach": "borussia-monchengladbach", "Ein Frankfurt": "eintracht-frankfurt", "Freiburg": "freiburg", "Heidenheim": "heidenheim", "Hoffenheim": "hoffenheim", "Holstein Kiel": "holstein-kiel", "RB Leipzig": "rb-leipzig", "Mainz": "mainz", "St Pauli": "st-pauli", "Stuttgart": "stuttgart", "Werder Bremen": "werder-bremen", "Wolfsburg": "wolfsburg", "Union Berlin": "union-berlin", "FC Koln": "koln", "Hamburg": "hamburgo", 
};

const StatBar = ({ label, l, a }) => {
  const total = parseInt(l) + parseInt(a) || 1;
  const lWidth = (parseInt(l) / total) * 100;
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem" }}>
        <span style={{ color: "#94A3B8" }}>{l}</span>
        <span style={{ color: "#FFF", fontWeight: "600" }}>{label}</span>
        <span style={{ color: "#94A3B8" }}>{a}</span>
      </div>
      <div style={{ height: "8px", backgroundColor: "#0F172A", borderRadius: "4px", overflow: "hidden", display: "flex", border: "1px solid #334155" }}>
        <div style={{ width: `${lWidth}%`, backgroundColor: "#0EE7AC" }} />
        <div style={{ width: `${100 - lWidth}%`, backgroundColor: "#F43F5E" }} />
      </div>
    </div>
  );
};

export const Liga = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [partidosPorJornada, setPartidosPorJornada] = useState({});

  const liga = searchParams.get("liga") || "España";
  const temp = searchParams.get("temp") || "2024-2025";
  const jornada = searchParams.get("jornada") || "1";

  const getLogoPath = (nombre) => {
    if (!nombre) return "/logos/default.png";
    const slug = MAPPING_EQUIPOS[nombre.trim()];
    return slug ? `/logos/${slug}.png` : "/logos/default.png";
  };

  useEffect(() => {
    const rawData = DATA[liga]?.[temp];
    if (!rawData) return;
    const lineas = rawData.split(/\r?\n/);
    const resultadoAgrupado = {};
    const config = liga === "Alemania" ? 9 : 10;
    for (let i = 1; i < lineas.length; i++) {
      const col = lineas[i].split(",");
      if (col.length < 5) continue;
      const numJornada = String(Math.floor((i - 1) / config) + 1);
      if (!resultadoAgrupado[numJornada]) resultadoAgrupado[numJornada] = [];
      resultadoAgrupado[numJornada].push({
        id: `m-${i}`, home: col[3], away: col[4], scoreHome: col[5], scoreAway: col[6],
        HS: col[11], AS: col[12], HST: col[13], AST: col[14], HC: col[17], AC: col[18], HF: col[15], AF: col[16]
      });
    }
    setPartidosPorJornada(resultadoAgrupado);
  }, [liga, temp]);

  const updateParams = (key, value) => {
    setSearchParams({ liga, temp, jornada: key === "jornada" ? value : "1", [key]: value });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>GoalHub</h1>
      
      {/* BARRA DE CONTROLES MODERNIZADA */}
      <div style={styles.filtersContainer}>
        <select 
          value={liga} 
          onChange={(e) => updateParams("liga", e.target.value)} 
          style={styles.select}
        >
          {Object.keys(DATA).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        
        <select 
          value={temp} 
          onChange={(e) => updateParams("temp", e.target.value)} 
          style={styles.select}
        >
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>
        
        {/* STEPPER DE JORNADA */}
        <div style={styles.stepperContainer}>
          <button 
            onClick={() => updateParams("jornada", Math.max(1, parseInt(jornada) - 1))} 
            style={styles.stepperBtn}
            onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            onMouseOut={(e) => e.target.style.background = "transparent"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <span style={styles.stepperText}>Jor. {jornada}</span>
          
          <button 
            onClick={() => updateParams("jornada", parseInt(jornada) + 1)} 
            style={styles.stepperBtn}
            onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            onMouseOut={(e) => e.target.style.background = "transparent"}
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div style={styles.list}>
        {(partidosPorJornada[jornada] || []).map(m => (
          <div key={m.id} onClick={() => setPartidoSeleccionado(m)} style={styles.card}>
            <div style={styles.matchHeader}>
              <div style={styles.teamContainerLocal}><span style={styles.team}>{m.home}</span><img src={getLogoPath(m.home)} style={styles.logo} onError={(e) => e.target.src = '/logos/default.png'} /></div>
              <div style={styles.score}>{m.scoreHome} - {m.scoreAway}</div>
              <div style={styles.teamContainerVisitante}><img src={getLogoPath(m.away)} style={styles.logo} onError={(e) => e.target.src = '/logos/default.png'} /><span style={styles.team}>{m.away}</span></div>
            </div>
          </div>
        ))}
      </div>

      {partidoSeleccionado && (
        <div style={styles.modalOverlay} onClick={() => setPartidoSeleccionado(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setPartidoSeleccionado(null)}>✕</button>
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "25px" }}>
                <div style={{ textAlign: "center" }}><img src={getLogoPath(partidoSeleccionado.home)} style={{ width: "65px" }} onError={(e) => e.target.src = '/logos/default.png'} /><div>{partidoSeleccionado.home}</div></div>
                <div style={{ fontSize: "2.5rem", fontWeight: "900" }}>{partidoSeleccionado.scoreHome} : {partidoSeleccionado.scoreAway}</div>
                <div style={{ textAlign: "center" }}><img src={getLogoPath(partidoSeleccionado.away)} style={{ width: "65px" }} onError={(e) => e.target.src = '/logos/default.png'} /><div>{partidoSeleccionado.away}</div></div>
              </div>
            </div>
            <div style={styles.statsDashboard}>
              <StatBar label="Tiros" l={partidoSeleccionado.HS} a={partidoSeleccionado.AS} />
              <StatBar label="A Puerta" l={partidoSeleccionado.HST} a={partidoSeleccionado.AST} />
              <StatBar label="Córners" l={partidoSeleccionado.HC} a={partidoSeleccionado.AC} />
              <StatBar label="Faltas" l={partidoSeleccionado.HF} a={partidoSeleccionado.AF} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  // Tu fondo verde original
  container: { padding: "40px 20px", maxWidth: "650px", margin: "0 auto", backgroundColor: "#26753c", minHeight: "100vh", fontFamily: "sans-serif" },
  title: { color: "#FFF", textAlign: "center", marginBottom: "25px", fontSize: "2.2rem", fontWeight: "bold" },
  
  // NUEVOS ESTILOS PARA LA BARRA SUPERIOR
  filtersContainer: { display: "flex", gap: "12px", justifyContent: "center", marginBottom: "30px", flexWrap: "wrap" },
  select: { 
    padding: "10px 14px", 
    borderRadius: "10px", 
    background: "#1E293B", 
    color: "#FFF", 
    border: "1px solid rgba(255, 255, 255, 0.15)", // Borde sutil
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Sombra para dar volumen
  },
  stepperContainer: {
    display: "flex",
    alignItems: "center",
    background: "#1E293B",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
  },
  stepperBtn: {
    background: "transparent",
    color: "#FFF",
    border: "none",
    padding: "0 12px",
    height: "100%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease",
  },
  stepperText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: "0.95rem",
    padding: "10px 8px",
    minWidth: "50px",
    textAlign: "center",
    userSelect: "none"
  },

  // TUS ESTILOS DE TARJETAS ORIGINALES (Mantenidos)
  list: { display: "flex", flexDirection: "column", gap: "15px" },
  card: { backgroundColor: "#1E293B", padding: "18px 24px", borderRadius: "14px", cursor: "pointer", color: "#FFF", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgba(255, 255, 255, 0.05)" },
  matchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  teamContainerLocal: { display: "flex", alignItems: "center", gap: "10px", flex: 1, justifyContent: "flex-end" },
  teamContainerVisitante: { display: "flex", alignItems: "center", gap: "10px", flex: 1, justifyContent: "flex-start" },
  team: { fontWeight: "600", fontSize: "1rem" },
  score: { backgroundColor: "#0EE7AC", color: "#0F172A", padding: "6px 16px", borderRadius: "8px", fontWeight: "900", fontSize: "1.1rem" },
  logo: { width: "40px", height: "40px", objectFit: "contain" },
  
  // MODAL
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 },
  modalContent: { backgroundColor: "#1E293B", padding: "30px", borderRadius: "20px", width: "90%", maxWidth: "420px", color: "#FFF", position: "relative" },
  closeButton: { position: "absolute", top: "15px", right: "20px", background: "none", border: "none", color: "#FFF", fontSize: "1.2rem", cursor: "pointer" },
  statsDashboard: { backgroundColor: "rgba(15, 23, 42, 0.5)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }
};