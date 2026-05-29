import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// IMPORTACIÓN DE TUS CSVs
import csvEspana from "../../../data/ESPAÑA-2024-2025.csv?raw";
import csvInglaterra from "../../../data/INGLATERRA-2024-2025.csv?raw";
import csvItalia from "../../../data/ITALIA-2024-2025.csv?raw";
import csvAlemania from "../../../data/ALEMANIA-2024-2025.csv?raw";

const CSV_POR_LIGA = {
  "La Liga": csvEspana,
  "Premier League": csvInglaterra,
  "Serie A": csvItalia,
  "Bundesliga": csvAlemania
};

const MAPPING_EQUIPOS = {
  "Ath Bilbao": "athletic-club", "Betis": "real-betis", "Celta": "celta-vigo", "Las Palmas": "las-palmas", "Leganes": "leganes", "Barcelona": "barcelona", "Vallecano": "rayo-vallecano", "Sociedad": "real-sociedad", "Valladolid": "valladolid", "Espanol": "espanol", "Real Madrid": "real-madrid", "Ath Madrid": "atletico-madrid", "Villarreal": "villarreal", "Sevilla": "sevilla", "Valencia": "valencia", "Girona": "girona", "Getafe": "getafe", "Mallorca": "mallorca", "Osasuna": "osasuna", "Alaves": "alaves",
  "Arsenal": "arsenal", "Aston Villa": "aston-villa", "Bournemouth": "bournemouth", "Brentford": "brentford", "Brighton": "brighton", "Chelsea": "chelsea", "Crystal Palace": "crystal-palace", "Everton": "everton", "Fulham": "fulham", "Ipswich": "ipswich", "Leicester": "leicester", "Liverpool": "liverpool", "Man City": "manchester-city", "Man United": "manchester-united", "Newcastle": "newcastle", "Forest": "nottingham-forest", "Southampton": "southampton", "Tottenham": "tottenham", "West Ham": "west-ham", "Wolves": "wolves",
  "Atalanta": "atalanta", "Bologna": "bologna", "Cagliari": "cagliari", "Como": "como", "Empoli": "empoli", "Fiorentina": "fiorentina", "Genoa": "genoa", "Inter": "inter-milan", "Juventus": "juventus", "Lazio": "lazio", "Lecce": "lecce", "Milan": "ac-milan", "Monza": "monza", "Napoli": "napoli", "Parma": "parma", "Roma": "as-roma", "Torino": "torino", "Udinese": "udinese", "Venezia": "venezia", "Verona": "hellas-verona",
  "Augsburg": "augsburg", "Leverkusen": "bayer-leverkusen", "Bayern Munich": "bayern-munich", "Bochum": "bochum", "Dortmund": "borussia-dortmund", "M'gladbach": "borussia-monchengladbach", "Eintracht Frankfurt": "eintracht-frankfurt", "Freiburg": "freiburg", "Heidenheim": "heidenheim", "Hoffenheim": "hoffenheim", "Holstein Kiel": "holstein-kiel", "RB Leipzig": "rb-leipzig", "Mainz": "mainz", "St Pauli": "st-pauli", "Stuttgart": "stuttgart", "Werder Bremen": "werder-bremen", "Wolfsburg": "wolfsburg", "Union Berlin": "union-berlin"
};

const StatBar = ({ label, l, a }) => {
  const total = parseInt(l) + parseInt(a) || 1;
  const lWidth = (parseInt(l) / total) * 100;

  // Lógica de "Corona": detecta quién ganó la métrica
  const isHomeWinner = parseInt(l) > parseInt(a);
  const isAwayWinner = parseInt(a) > parseInt(l);

  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem" }}>
        <span style={{ color: isHomeWinner ? "#F59E0B" : "#94A3B8", fontWeight: isHomeWinner ? "bold" : "normal" }}>
          {isHomeWinner ? "👑 " : ""}{l}
        </span>
        <span style={{ color: "#FFF", fontWeight: "600" }}>{label}</span>
        <span style={{ color: isAwayWinner ? "#F59E0B" : "#94A3B8", fontWeight: isAwayWinner ? "bold" : "normal" }}>
          {a}{isAwayWinner ? " 👑" : ""}
        </span>
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
  const liga = searchParams.get("liga") || "La Liga";
  const jornadaActiva = searchParams.get("jornada") || "1";
  const [partidosPorJornada, setPartidosPorJornada] = useState({});
  const [loading, setLoading] = useState(true);

  const getLogoPath = (nombre) => nombre ? `/logos/${MAPPING_EQUIPOS[nombre.trim()]}.png` : null;

  useEffect(() => {
    setLoading(true);
    const lineas = CSV_POR_LIGA[liga].split(/\r?\n/);
    const resultadoAgrupado = {};
    const config = liga === "Bundesliga" ? 9 : 10;
    for (let i = 1; i < lineas.length; i++) {
      const col = lineas[i].split(",");
      if (col.length < 5) continue;
      const numJornada = String(Math.floor((i - 1) / config) + 1);
      if (!resultadoAgrupado[numJornada]) resultadoAgrupado[numJornada] = [];
      resultadoAgrupado[numJornada].push({
        id: `match-${i}`, home: col[3], away: col[4], scoreHome: col[5], scoreAway: col[6],
        HS: col[11], AS: col[12], HST: col[13], AST: col[14], HC: col[17], AC: col[18], HF: col[15], AF: col[16]
      });
    }
    setPartidosPorJornada(resultadoAgrupado);
    setLoading(false);
  }, [liga]);

  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>GoalHub</h1>
        <div style={styles.list}>
          {(partidosPorJornada[jornadaActiva] || []).map(m => (
            <div key={m.id} onClick={() => setPartidoSeleccionado(m)} style={{ ...styles.card, cursor: "pointer" }}>
              <div style={styles.matchHeader}>
                <div style={styles.teamContainerLocal}>
                  <span style={styles.team}>{m.home}</span> <img src={getLogoPath(m.home)} style={styles.logo} alt="" />
                </div>
                <div style={styles.score}>{m.scoreHome} - {m.scoreAway}</div>
                <div style={styles.teamContainerVisitante}>
                  <img src={getLogoPath(m.away)} style={styles.logo} alt="" /> <span style={styles.team}>{m.away}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {partidoSeleccionado && (
        <div style={styles.modalOverlay} onClick={() => setPartidoSeleccionado(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setPartidoSeleccionado(null)}>✕</button>

            {/* CABECERA: Marcador con estilo "Broadcast" */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748B", letterSpacing: "2px", textTransform: "uppercase" }}>Resultado Final</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "25px", marginTop: "15px" }}>
                <div style={{ textAlign: "center" }}>
                  <img src={getLogoPath(partidoSeleccionado.home)} style={{ width: "65px", height: "65px" }} />
                  <div style={{ fontSize: "0.75rem", marginTop: "5px", fontWeight: "bold" }}>{partidoSeleccionado.home}</div>
                </div>

                <div style={{ fontSize: "2.8rem", fontWeight: "900", color: "#FFF", fontFamily: "monospace", textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>
                  {partidoSeleccionado.scoreHome} : {partidoSeleccionado.scoreAway}
                </div>

                <div style={{ textAlign: "center" }}>
                  <img src={getLogoPath(partidoSeleccionado.away)} style={{ width: "65px", height: "65px" }} />
                  <div style={{ fontSize: "0.75rem", marginTop: "5px", fontWeight: "bold" }}>{partidoSeleccionado.away}</div>
                </div>
              </div>
            </div>

            {/* DASHBOARD DE ANÁLISIS TÉCNICO */}
            <div style={styles.statsDashboard}>
              <h4 style={{ color: "#94A3B8", fontSize: "0.8rem", marginBottom: "15px", textAlign: "center", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>ESTADÍSTICAS DEL PARTIDO</h4>

              <StatBar label="Tiros Totales" l={partidoSeleccionado.HS} a={partidoSeleccionado.AS} />
              <StatBar label="A Puerta" l={partidoSeleccionado.HST} a={partidoSeleccionado.AST} />
              <StatBar label="Córners" l={partidoSeleccionado.HC} a={partidoSeleccionado.AC} />
              <StatBar label="Faltas" l={partidoSeleccionado.HF} a={partidoSeleccionado.AF} />
            </div>

            {/* FOOTER DE EFICIENCIA (Cálculo dinámico) */}
            <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ background: "rgba(14, 231, 172, 0.1)", padding: "10px", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0EE7AC" }}>
                  {((partidoSeleccionado.HST / (partidoSeleccionado.HS || 1)) * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: "0.65rem", color: "#0EE7AC" }}>PRECISIÓN LOCAL</div>
              </div>
              <div style={{ background: "rgba(244, 63, 94, 0.1)", padding: "10px", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#F43F5E" }}>
                  {((partidoSeleccionado.AST / (partidoSeleccionado.AS || 1)) * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: "0.65rem", color: "#F43F5E" }}>PRECISIÓN VISITA</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: { padding: "40px 20px", maxWidth: "650px", margin: "0 auto", backgroundColor: "#26753c", minHeight: "100vh" },
  title: { color: "#FFFFFF", textAlign: "center", marginBottom: "25px", fontWeight: "700", fontSize: "2.2rem" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { backgroundColor: "#1E293B", padding: "18px 24px", borderRadius: "14px", boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" },
  matchHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  teamContainerLocal: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", flex: "1" },
  teamContainerVisitante: { display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "10px", flex: "1" },
  team: { fontSize: "1rem", color: "#FFFFFF", fontWeight: "600" },
  score: { fontSize: "1.2rem", color: "#0F172A", padding: "4px 12px", margin: "0 15px", fontWeight: "700", backgroundColor: "#0EE7AC", borderRadius: "12px" },
  logo: { width: "40px", height: "40px", objectFit: "contain" },

  // CORREGIDO: Separación de propiedades
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  modalContent: {
    backgroundColor: "#1E293B", padding: "40px", borderRadius: "24px", width: "90%", maxWidth: "420px", color: "#FFFFFF", position: "relative", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255,255,255,0.1)", borderColor: parseInt(partidoSeleccionado.scoreHome) > parseInt(partidoSeleccionado.scoreAway) ? "#0EE7AC" : "#F43F5E"
  },
  closeButton: { position: "absolute", top: "10px", right: "15px", background: "none", border: "none", color: "#FFF", fontSize: "2rem", cursor: "pointer" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  teamBadge: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100px" },
  modalLogo: { width: "60px", height: "60px", objectFit: "contain" },
  teamName: { fontSize: "0.85rem", fontWeight: "600", color: "#FFF", textAlign: "center" },
  modalScore: { fontSize: "2.5rem", fontWeight: "800", color: "#0EE7AC", textShadow: "0 0 15px rgba(14, 231, 172, 0.4)" },
  statsDashboard: { backgroundColor: "rgba(15, 23, 42, 0.5)", padding: "20px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }
};