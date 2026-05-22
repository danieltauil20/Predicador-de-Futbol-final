import React, { useState, useEffect } from "react";
import "../body.css";

export const TablaPosiciones = ({ ligaId, nombreLiga }) => {
    const [equipos, setEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerClasificacion = async () => {
            try {
                const response = await fetch(`https://v3.football.api-sports.io/standings?league=${ligaId}&season=2024`, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "v3.football.api-sports.io",
                        "x-rapidapi-key": "0e444c9bb6cd911293c67b65177843ab"
                    }
                });
                const data = await response.json();
                
                if (data.response && data.response.length > 0) {
                    const tabla = data.response[0].league.standings[0];
                    setEquipos(tabla);
                }
            } catch (error) {
                console.error("Error al obtener posiciones:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerClasificacion();
    }, [ligaId]);

    // Contenedor de carga alineado al mismo estilo y tamaño
    if (cargando) return <div className="tabla-sidebar-right cargando-sidebar">Cargando...</div>;

    return (
        <div className="tabla-sidebar-right">
            <div className="tabla-header">
                <h3 className="poppins-semibold">
                    Clasificación <span className="text-teal">{nombreLiga}</span>
                </h3>
            </div>
            <div className="contenedor-scroll">
                <table className="tabla-datos">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>EQUIPO</th>
                            <th>PJ</th>
                            <th>PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipos.map((item) => (
                            <tr key={item.team.id} className="fila-equipo">
                                <td className="txt-bold">{item.rank}</td>
                                <td className="txt-nombre">
                                    <img src={item.team.logo} alt={item.team.name} className="mini-escudo" />
                                    {item.team.name}
                                </td>
                                <td>{item.all.played}</td>
                                <td className="text-teal txt-bold">{item.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};