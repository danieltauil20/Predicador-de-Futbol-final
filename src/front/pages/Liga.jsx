import { useParams } from "react-router-dom";
import { TablaPosiciones } from "../components/TablaPosiciones";
import React, { useEffect, useState } from "react";

export const Liga = () => {
  const [allPartidos, setAllPartidos] = useState([]);
  const [partidosFiltrados, setPartidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ligaSeleccionada, setLigaSeleccionada] = useState("PD");
  const [temporada, setTemporada] = useState("2025");
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(1);
  const [favoritos, setFavoritos] = useState(() => JSON.parse(localStorage.getItem("mis_partidos_favoritos") || "[]"));

  const [partidoExpandido, setPartidoExpandido] = useState(null);
  const [detallePartido, setDetallePartido] = useState(null);

  const baseUrl = window.location.origin.includes("github.dev")
    ? window.location.origin.replace("-3000", "-3001") + "/api/fixtures"
    : "http://localhost:3001/api/fixtures";

  const consultarDatos = async () => {
    setLoading(true);
    try {
      const url = `${baseUrl}/historico?liga=${ligaSeleccionada}&jornada=${jornadaSeleccionada}&temporada=${temporada}`;
      const res = await fetch(url);
      const data = await res.json();
      setAllPartidos(data || []);
      setPartidosFiltrados(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const cargarDetalle = async (id) => {
    try {
      const res = await fetch(`${baseUrl.replace("/fixtures", "")}/partido/detalle/${id}`);
      const data = await res.json();
      setDetallePartido(data);
    } catch (err) { console.error("Error detalle:", err); }
  };

  useEffect(() => { consultarDatos(); }, [ligaSeleccionada, jornadaSeleccionada, temporada]);

  const toggleFavorito = (e, partidoId) => {
    e.stopPropagation();
    const nuevos = favoritos.includes(partidoId) ? favoritos.filter(id => id !== partidoId) : [...favoritos, partidoId];
    setFavoritos(nuevos);
    localStorage.setItem("mis_partidos_favoritos", JSON.stringify(nuevos));
  };

  // Diccionario para asignar el ID correcto según slug
  const ligasIds = {
    "LaLiga": "140",
    "Premier": "39",
    "SerieA": "135",
    "Bundesliga": "78",
    "Mundial": "1"
  };

  // ID que corresponde al nombre
  const idActual = ligasIds[nombre] || "140";

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
      <h1>Liga: {nombre}</h1>
      <div style={{ 
        display: "flex", 
        justifyContent: "flex-end", /* Esta es la clave: empuja el contenido a la derecha */
        maxWidth: "1200px",         /* Mantiene un ancho máximo para que no se pegue al borde del monitor */
        margin: "0 auto",           /* Centra el contenedor principal en la pantalla */
        gap: "20px"}}>
      <>
        <TablaPosiciones ligaId={idActual} nombreLiga={nombre} />
      </>
    <div className="live-score-wrapper">
      <style>{`
        .live-score-wrapper { font-family: Arial, sans-serif; background-color: #0f111a; min-height: 100vh; color: #b2bdcd; padding: 20px; }
        .live-score-container { max-width: 950px; margin: 0 auto; background-color: #151824; border-radius: 10px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.6); }
        .jornada-selector-container { background-color: #08090d; padding: 14px 20px; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #1f2436; }
        .jornada-select { background-color: #1a1e2d; border: 1px solid #293047; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
        .league-capsule-bar { display: flex; background-color: #12141f; padding: 14px 20px; gap: 12px; border-bottom: 1px solid #1f2436; }
        .capsule-btn { background-color: #1a1e2d; border: 1px solid #293047; color: #9bb0cb; padding: 8px 18px; border-radius: 30px; cursor: pointer; }
        .capsule-btn.active { background-color: #fbbf24; color: #08090d; }
        .match-card { border-bottom: 1px solid #111420; background-color: #181c2b; padding: 18px 20px; cursor: pointer; }
        .teams-score-display { display: grid; grid-template-columns: 1fr 100px 1fr; align-items: center; gap: 15px; }
        .score-box-center { font-size: 1.25rem; font-weight: 700; color: #fbbf24; background-color: #08090d; padding: 6px 12px; border-radius: 5px; text-align: center; }
        .team-crest { width: 28px; height: 28px; object-fit: contain; }
        .fav-star-btn { background: none; border: none; font-size: 1.3rem; color: #3b4252; cursor: pointer; }
        .fav-star-btn.is-fav { color: #fbbf24; }
        .detalle-eventos { grid-column: span 2; margin-top: 15px; padding: 10px; border-top: 1px solid #293047; color: #9bb0cb; font-size: 0.85rem; }
      `}</style>

      <div className="live-score-container">
        <div className="jornada-selector-container">
          <select value={temporada} onChange={(e) => setTemporada(e.target.value)} className="jornada-select">
            <option value="2024">Temporada 24/25</option>
            <option value="2025">Temporada 25/26</option>
          </select>
          <select value={jornadaSeleccionada} onChange={(e) => setJornadaSeleccionada(Number(e.target.value))} className="jornada-select">
            {Array.from({ length: 38 }, (_, i) => <option key={i + 1} value={i + 1}>Jornada {i + 1}</option>)}
          </select>
        </div>

        <div className="league-capsule-bar">
          <button className={`capsule-btn ${ligaSeleccionada === "PD" ? "active" : ""}`} onClick={() => setLigaSeleccionada("PD")}>🇪🇸 LaLiga</button>
          <button className={`capsule-btn ${ligaSeleccionada === "PL" ? "active" : ""}`} onClick={() => setLigaSeleccionada("PL")}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier</button>
          <button className={`capsule-btn ${ligaSeleccionada === "SA" ? "active" : ""}`} onClick={() => setLigaSeleccionada("SA")}>🇮🇹 Serie A</button>
          <button className={`capsule-btn ${ligaSeleccionada === "BL" ? "active" : ""}`} onClick={() => setLigaSeleccionada("BL")}>🇩🇪 Bundesliga</button>
          <button className={`capsule-btn ${ligaSeleccionada === "WC" ? "active" : ""}`} onClick={() => setLigaSeleccionada("WC")}>🌍 Mundial 2026</button>
        </div>

        <div className="matches-list-holder">
          {loading ? <p style={{ color: '#fff', textAlign: 'center', padding: '20px' }}>Cargando...</p> :
            partidosFiltrados.map((m) => (
              <div key={m.id} className="match-card" onClick={() => {
                if (partidoExpandido === m.id) { setPartidoExpandido(null); }
                else { setPartidoExpandido(m.id); cargarDetalle(m.id); }
              }}>
                <button className={`fav-star-btn ${favoritos.includes(m.id) ? "is-fav" : ""}`} onClick={(e) => toggleFavorito(e, m.id)}>★</button>
                <div className="teams-score-display">
                  <div className="team-box-side" style={{ justifyContent: 'flex-end', display: 'flex', gap: '10px' }}>
                    {m.homeTeam.name} <img src={m.homeTeam.crest} className="team-crest" alt="" />
                  </div>
                  <div className="team-box-side" style={{ justifyContent: 'flex-start', display: 'flex', gap: '10px' }}><img src={m.awayTeam.crest} className="team-crest" alt="" /> {m.awayTeam.name}</div>
                </div>

                {partidoExpandido === m.id && detallePartido && (
                  <div className="detalle-eventos">
                    <p>⚽ <strong>Goles:</strong> {detallePartido.goles?.map(g => g.jugador).join(", ") || "Sin datos"}</p>
                    <p>🟨 <strong>Tarjetas:</strong> {detallePartido.tarjetas?.map(t => t.jugador).join(", ") || "Sin datos"}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};