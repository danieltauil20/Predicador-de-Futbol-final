import { useState } from "react";
import PartidosTop from "../components/PartidosTop";
import ComentariosPartido from "../components/ComentariosPartido";
import ForoMini from "../components/ForoMini";
import Normas from "../components/Normas";

export const Comentarios = () => {
  const [partido, setPartido] = useState({
    id: 5,
    home: "Arsenal",
    away: "Chelsea",
    homeLogo: "https://football-data.org",
    awayLogo: "https://football-data.org",
  });

  return (
    <div className="pagina">
      {/* ⚽ 1. FILA SUPERIOR: Partidos TOP */}
      <h1 className="titulo">🔥 Partidos TOP</h1>
      <PartidosTop setPartido={setPartido} />

      {/* 📊 2. FILA INFERIOR: Estructura de 3 columnas */}
      <div className="zona-inferior">
        {/* COLUMNA 1: Foro */}
        <div className="foro-grande">
          <ForoMini />
        </div>

        {/* COLUMNA 2: Comentarios */}
        <div className="comentarios-grande">
          <ComentariosPartido partido={partido} />
        </div>

        {/* COLUMNA 3: Normas */}
        <div className="normas-box-derecha">
          <Normas />
        </div>
      </div>
    </div>
  );
};

export default Comentarios;
