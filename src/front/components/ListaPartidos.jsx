import React, { useState, useMemo, useEffect } from "react";
import { todosLosPartidos } from "../data_partidos/index.js";

export const ListaPartidos = ({ ligaId }) => {
    const [temporada, setTemporada] = useState("");
    const [jornada, setJornada] = useState("1");

    const { temporadasDisponibles, jornadasDisponibles, partidosFiltrados } = useMemo(() => {
        // Mapa simple para convertir nombres humanos a tus códigos de base de datos
        const mapa = {
            'la-liga': 'SP1',
            'bundesliga': 'D1',
            'premier': 'E0',
            'serie-a': 'I1'
        };

        // Si ligaId está en el mapa, usamos el valor. Si no, usamos el mismo ligaId.
        const idBuscado = (mapa[String(ligaId).toLowerCase()] || String(ligaId)).toUpperCase();

        const partidosDeLaLiga = todosLosPartidos.filter(p =>
            String(p.Div).toUpperCase() === idBuscado
        );

        const temps = [...new Set(partidosDeLaLiga.map(p => p.Season))];
        const tempSeleccionada = temporada || (temps.length > 0 ? temps[0] : "");

        const jornadas = [...new Set(partidosDeLaLiga
            .filter(p => p.Season === tempSeleccionada)
            .map(p => String(p.Round)))]
            .sort((a, b) => parseInt(a) - parseInt(b));

        const filtrados = partidosDeLaLiga.filter(p =>
            p.Season === tempSeleccionada && String(p.Round) === jornada
        );

        return { temporadasDisponibles: temps, jornadasDisponibles: jornadas, partidosFiltrados: filtrados };
    }, [ligaId, temporada, jornada]);

    useEffect(() => {
        if (temporadasDisponibles.length > 0 && !temporada) {
            setTemporada(temporadasDisponibles[0]);
        }
    }, [temporadasDisponibles, temporada]);

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                <select value={temporada} onChange={(e) => { setTemporada(e.target.value); setJornada("1"); }} style={selectStyle}>
                    {temporadasDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={jornada} onChange={(e) => setJornada(e.target.value)} style={selectStyle}>
                    {jornadasDisponibles.length > 0 ? (
                        jornadasDisponibles.map(r => <option key={r} value={r}>Jornada {r}</option>)
                    ) : (
                        <option value="1">Sin partidos</option>
                    )}
                </select>
            </div>

            <div className="lista-tarjetas">
                {partidosFiltrados.length > 0 ? (
                    partidosFiltrados.map((p, index) => (
                        <div key={index} style={cardStyle}>
                            <div style={{ color: "#a1a1a6", fontSize: "0.8rem", width: "70px" }}>
                                {p.Date}<br /><span style={{ color: "#fff", fontWeight: "bold" }}>{p.Time}</span>
                            </div>
                            <div style={{ flexGrow: 1, textAlign: "center", fontWeight: "600", color: "#fff" }}>
                                {p.HomeTeam} vs {p.AwayTeam}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#fff", textAlign: "center" }}>No hay partidos para esta selección.</p>
                )}
            </div>
        </div>
    );
};

const selectStyle = { padding: "12px", borderRadius: "8px", backgroundColor: "#1c1c1e", color: "#fff", border: "1px solid #333", cursor: "pointer", textAlign: "center" };
const cardStyle = { backgroundColor: "#1c1c1e", borderRadius: "12px", padding: "15px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: "4px solid #0ee7ac" };