import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

// IMPORTACIONES
import ale24 from "../../data/ALEMANIA-2024-2025.csv?raw";
import ale25 from "../../data/ALEMANIA-2025-2026.csv?raw";
import esp24 from "../../data/ESPAÑA-2024-2025.csv?raw";
import esp25 from "../../data/ESPAÑA-2025-2026.csv?raw";
import ing24 from "../../data/INGLATERRA-2024-2025.csv?raw";
import ing25 from "../../data/INGLATERRA-2025-2026.csv?raw";
import ita24 from "../../data/ITALIA-2024-2025.csv?raw";
import ita25 from "../../data/ITALIA-2025-2026.csv?raw";

const DATA = {
  "España": { "2024-2025": esp24, "2025-2026": esp25 },
  "Inglaterra": { "2024-2025": ing24, "2025-2026": ing25 },
  "Italia": { "2024-2025": ita24, "2025-2026": ita25 },
  "Alemania": { "2024-2025": ale24, "2025-2026": ale25 }
};

export const Liga = () => {
  // 1. Obtenemos el nombre de la liga de la URL (ruta /liga/:nombre)
  const { nombre } = useParams(); 
  
  // 2. Obtenemos temporada y jornada de los query params (?temp=...&jornada=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const temp = searchParams.get("temp") || "2024-2025";
  const jornada = searchParams.get("jornada") || "1";

  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    // Usamos 'nombre' que viene de la URL
    const rawData = DATA[nombre]?.[temp];

    if (!rawData) {
      console.error("No se encontraron datos para", nombre, temp);
      return;
    }

    const lineas = rawData.split(/\r?\n/).filter(l => l.trim() !== "");
    const lista = lineas.slice(1).map((linea, index) => {
        const col = linea.split(",");
        return {
            id: index,
            home: col[3],
            away: col[4],
            score: `${col[5]} - ${col[6]}`,
            jornadaCalculada: Math.floor(index / 10) + 1
        };
    });

    setPartidos(lista.filter(p => String(p.jornadaCalculada) === String(jornada)));
  }, [nombre, temp, jornada]); // Ahora dependemos de 'nombre' en lugar de 'liga'

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1>Liga: {nombre} - {temp}</h1>
      <p>Jornada actual: {jornada}</p>
      
      {partidos.length > 0 ? (
        partidos.map((p, i) => (
          <div key={i} style={{ border: "1px solid #444", margin: "10px", padding: "10px", borderRadius: "8px" }}>
            {p.home} <strong>{p.score}</strong> {p.away}
          </div>
        ))
      ) : (
        <p>No hay partidos para mostrar en esta jornada.</p>
      )}
    </div>
  );
};