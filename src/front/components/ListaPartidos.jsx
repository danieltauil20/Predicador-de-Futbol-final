import React, { useState, useMemo } from "react";
import { todosLosPartidos } from "../data_partidos/index.js";

// Función de mapeo inteligente
const getLogoPath = (name) => {
    if (!name) return "";
    const nombreBase = name.toLowerCase().replace(/\s+/g, '-');
    const mapaEscudos = {
        "leverkusen": "bayer-leverkusen", "fc-koln": "koln", "m'gladbach": "borussia-monchengladbach",
        "hamburg": "hamburgo", "dortmund": "borussia-dortmund", "oviedo": "real-oviedo",
        "vallecano": "rayo-vallecano", "betis": "real-betis", "sociedad": "real-sociedad",
        "celta": "celta-vigo", "ath-bilbao": "athletic-club", "ath-madrid": "atletico-madrid",
        "man-city": "manchester-city", "nott'm-forest": "nottingham-forest", "man-united": "manchester-united",
        "milan": "ac-milan", "roma": "as-roma", "verona": "hellas-verona", "inter": "inter-milan",
        "ein-frankfurt": "eintracht-frankfurt"
    };
    return `/logos/${mapaEscudos[nombreBase] || nombreBase}.png`;
};

export const ListaPartidos = ({ ligaId }) => {
    const [temporada, setTemporada] = useState("2025-2026");
    const [jornada, setJornada] = useState("1");
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

    const { partidosFiltrados, numeroTotalJornadas } = useMemo(() => {
        const mapaLigas = { 'la-liga': 'SP1', 'bundesliga': 'D1', 'premier': 'E0', 'serie-a': 'I1', 'italia': 'I1' };
        const idNormalizado = String(ligaId).toLowerCase().replace(/\s+/g, '');
        let idBuscado = mapaLigas[idNormalizado] || String(ligaId).toUpperCase();
        if (idNormalizado.includes('premier')) idBuscado = 'E0';

        let datos = todosLosPartidos
            .filter(p => String(p.Div).toUpperCase() === idBuscado)
            .map(p => {
                const [d, m, y] = p.Date.split('/').map(Number);
                const fecha = new Date(y, m - 1, d);
                return { ...p, fechaObj: fecha, temp: fecha >= new Date(2025, 6, 1) ? "2025-2026" : "2024-2025" };
            })
            .sort((a, b) => a.fechaObj - b.fechaObj);

        datos = datos.filter(p => p.temp === temporada);
        const totalJornadas = (idBuscado === 'D1') ? 34 : 38;
        const partidosPorJornada = (idBuscado === 'D1') ? 9 : 10;

        const conJornadas = datos.map((p, index) => ({
            ...p, jornadaVirtual: Math.floor(index / partidosPorJornada) + 1
        }));

        return {
            partidosFiltrados: conJornadas.filter(p => String(p.jornadaVirtual) === String(jornada)),
            numeroTotalJornadas: totalJornadas
        };
    }, [ligaId, temporada, jornada]);

    const statsComparativas = [
        { label: "Tiros Totales", h: "HS", a: "AS" },
        { label: "Tiros a Puerta", h: "HST", a: "AST" },
        { label: "Faltas", h: "HF", a: "AF" },
        { label: "Córners", h: "HC", a: "AC" },
        { label: "Tarjetas Amarillas", h: "HY", a: "AY" },
        { label: "Tarjetas Rojas", h: "HR", a: "AR" }
    ];

    return (
        <div style={pageStyle}>
            <h2 style={h2Style}>{ligaId.toUpperCase()}</h2>

            <div style={filterContainerStyle}>
                <select value={temporada} onChange={(e) => { setTemporada(e.target.value); setJornada("1"); }} style={pillSelectStyle}>
                    <option value="2024-2025">2024/2025</option>
                    <option value="2025-2026">2025/2026</option>
                </select>

                <select value={jornada} onChange={(e) => setJornada(e.target.value)} style={pillSelectStyle}>
                    {Array.from({ length: numeroTotalJornadas }, (_, i) => i + 1).map(j => (
                        <option key={j} value={j}>Jornada {j}</option>
                    ))}
                </select>
            </div>

            <div style={listContainerStyle}>
                {partidosFiltrados.map((p, i) => (
                    <div
                        key={i}
                        style={{ ...matchRowStyle, transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                        }}
                        onClick={() => setPartidoSeleccionado(p)}
                    >
                        {/* Aquí va todo el contenido que ya tienes dentro de la fila */}
                        <div style={teamLocalWrapperStyle}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#26753c", marginRight: "8px" }}></div>

                            <img src={getLogoPath(p.HomeTeam)} alt={p.HomeTeam} style={logoStyle} />
                            <span style={teamNameStyle}>{p.HomeTeam}</span>
                        </div>

                        <div style={scoreBoxStyle}>
                            <div style={numberCardStyle}>{p.FTHG}</div>
                            <div style={{ fontWeight: "800", color: "#FFFFFF", margin: "0 8px" }}>-</div>
                            <div style={numberCardStyle}>{p.FTAG}</div>
                        </div>

                        <div style={teamAwayWrapperStyle}>
                            <span style={teamNameStyle}>{p.AwayTeam}</span>
                            <img src={getLogoPath(p.AwayTeam)} alt={p.AwayTeam} style={logoStyle} onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL ESTRUCTURADO Y VERDE */}
            {partidoSeleccionado && (
                <div style={modalOverlayStyle} onClick={() => setPartidoSeleccionado(null)}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={modalTopBarStyle}>
                            <span style={modalDateStyle}>{partidoSeleccionado.Date} {partidoSeleccionado.Time && `- ${partidoSeleccionado.Time}`}</span>
                            <button style={closeButtonStyle} onClick={() => setPartidoSeleccionado(null)}>✕</button>
                        </div>
                        <div style={modalScrollArea}>
                            <div style={modalHeaderScoreboardStyle}>
                                <div style={modalTeamBigStyle}>
                                    <img src={getLogoPath(partidoSeleccionado.HomeTeam)} alt={partidoSeleccionado.HomeTeam} style={modalLogoBigStyle} onError={(e) => { e.target.style.display = 'none'; }} />
                                    <span style={modalTeamNameBigStyle}>{partidoSeleccionado.HomeTeam}</span>
                                </div>
                                <div style={modalScoreBigContainerStyle}>
                                    <div style={modalScoreBigNumberStyle}>{partidoSeleccionado.FTHG}</div>
                                    <div style={modalScoreDividerStyle}>-</div>
                                    <div style={modalScoreBigNumberStyle}>{partidoSeleccionado.FTAG}</div>
                                </div>
                                <div style={modalTeamBigStyle}>
                                    <img src={getLogoPath(partidoSeleccionado.AwayTeam)} alt={partidoSeleccionado.AwayTeam} style={modalLogoBigStyle} onError={(e) => { e.target.style.display = 'none'; }} />
                                    <span style={modalTeamNameBigStyle}>{partidoSeleccionado.AwayTeam}</span>
                                </div>
                            </div>
                            {partidoSeleccionado.HTHG !== undefined && partidoSeleccionado.HTAG !== undefined && (
                                <div style={halfTimeStyle}>Descanso: {partidoSeleccionado.HTHG} - {partidoSeleccionado.HTAG}</div>
                            )}
                            <div style={sectionContainerStyle}>
                                <h4 style={sectionTitleStyle}>Estadísticas del Partido</h4>
                                <div style={statsComparisonWrapperStyle}>
                                    {statsComparativas.map((stat, idx) => {
                                        const homeVal = partidoSeleccionado[stat.h];
                                        const awayVal = partidoSeleccionado[stat.a];
                                        if (homeVal === undefined && awayVal === undefined) return null;
                                        return (
                                            <div key={idx} style={statRowStyle}>
                                                <span style={statRowValueStyle}>{homeVal ?? '-'}</span>
                                                <span style={statRowLabelStyle}>{stat.label}</span>
                                                <span style={statRowValueStyle}>{awayVal ?? '-'}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS DE LA PANTALLA PRINCIPAL (VERDE ORIGINAL) ---
const pageStyle = { fontFamily: "'Poppins', sans-serif", backgroundColor: "transparent", minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" };
const h2Style = { color: "#FFFFFF", fontWeight: "700", fontSize: "28px", marginBottom: "20px" };
const filterContainerStyle = { display: "flex", gap: "12px", marginBottom: "20px" };
const pillSelectStyle = { backgroundColor: "#1E293B", color: "#FFFFFF", border: "none", padding: "12px 28px", borderRadius: "24px", fontWeight: "500", fontSize: "15px", cursor: "pointer", outline: "none" };
const listContainerStyle = { width: "100%", maxWidth: "1100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "15px", padding: "12px" };
const matchRowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "20px 24px",
    // Usamos un tono verde ligeramente más claro que el fondo, con una opacidad para integrar
    backgroundColor: "#1E293B",
    // Un borde sutil de 1px que le da definición sin ser un "marco" pesado
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    boxShadow: "none",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    marginBottom: "12px",
    transition: "all 0.3s ease"
};
const teamLocalWrapperStyle = { display: "flex", alignItems: "center", gap: "14px", justifyContent: "flex-start" };
const teamAwayWrapperStyle = { display: "flex", alignItems: "center", gap: "14px", justifyContent: "flex-end" };
const logoStyle = { width: "50px", height: "50px", objectFit: "contain", flexShrink: 0 };
const teamNameStyle = {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: "15px"
};
const scoreBoxStyle = { display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "0 20px" };
const scoreNumberStyle = { fontWeight: "800", fontSize: "16px", color: "white" };
const scoreDividerStyle = { margin: "0 8px", fontWeight: "800", fontSize: "16px", color: "white" };
const numberCardStyle = {
    backgroundColor: "white", // Un rojo intenso pero profesional
    color: "#2A394E",
    padding: "6px 16px",
    borderRadius: "8px",
    fontWeight: "800",
    fontSize: "17px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
};


// --- ESTILOS DEL MODAL (VERDE ORIGINAL) ---
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" };
const modalContentStyle = { backgroundColor: "#1B4326", borderRadius: "12px", width: "100%", maxWidth: "540px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden", border: "1px solid #26753c" };
const modalTopBarStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", backgroundColor: "#26753c", borderBottom: "1px solid rgba(255,255,255,0.1)" };
const modalDateStyle = { color: "#A0D4B1", fontSize: "14px", fontWeight: "600" };
const closeButtonStyle = { background: "none", border: "none", color: "#FFFFFF", fontSize: "24px", cursor: "pointer" };
const modalScrollArea = { overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" };
const modalHeaderScoreboardStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", backgroundColor: "#26753c", borderRadius: "12px" };
const modalTeamBigStyle = { display: "flex", flexDirection: "column", alignItems: "center", width: "30%", gap: "12px" };
const modalLogoBigStyle = { width: "70px", height: "70px", objectFit: "contain" };
const modalTeamNameBigStyle = { color: "#FFFFFF", fontWeight: "700", fontSize: "14px", textAlign: "center" };
const modalScoreBigContainerStyle = { display: "flex", alignItems: "center", gap: "12px" };
const modalScoreBigNumberStyle = { backgroundColor: "#FFFFFF", color: "#1B4326", fontSize: "32px", fontWeight: "800", padding: "10px 20px", borderRadius: "8px", minWidth: "50px", textAlign: "center" };
const modalScoreDividerStyle = { color: "#FFFFFF", fontSize: "28px", fontWeight: "700" };
const halfTimeStyle = { textAlign: "center", color: "#A0D4B1", fontSize: "14px", marginTop: "-12px" };
const sectionContainerStyle = { backgroundColor: "#26753c", padding: "20px", borderRadius: "12px" };
const sectionTitleStyle = { margin: "0 0 16px 0", color: "#A0D4B1", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", textAlign: "center" };
const statsComparisonWrapperStyle = { display: "flex", flexDirection: "column" };
const statRowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" };
const statRowValueStyle = { width: "40px", textAlign: "center", fontWeight: "700", fontSize: "16px", color: "#FFFFFF" };
const statRowLabelStyle = { flex: 1, textAlign: "center", color: "#FFFFFF", fontSize: "14px", fontWeight: "600" };