import React from "react";
import { todosLosPartidos as partidos } from "../data_partidos/index.js";
import "../body.css";

export const TablaPosiciones = ({ ligaId, nombreLiga }) => {
    // Filtramos los datos al vuelo (es instantáneo)
    const equipos = datos.filter(item => item.liga === ligaId);

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
                        {equipos.map((item, index) => (
                            <tr key={index} className="fila-equipo">
                                <td>{item.rank}</td>
                                <td>{item.team}</td>
                                <td>{item.played}</td>
                                <td>{item.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};