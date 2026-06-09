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
  });

  return (
    <div className="pagina" style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px", fontFamily: "'Poppins', sans-serif" }}>
      <PartidosTop setPartido={setPartido} />

      {/* Contenedor de 2 columnas alineadas a la misma altura */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px", alignItems: "stretch" }}>

        {/* COLUMNA 1: Foro (Más estrecha) */}
        <div style={{ flex: 1 }}>
          <ForoMini />
        </div>

        {/* COLUMNA 2: Comentarios del Partido (Más ancha) */}
        <div style={{ flex: 2 }}>
          <ComentariosPartido partido={partido} />
        </div>

      </div>


      <Normas />

    </div>
  );
};

export default Comentarios;