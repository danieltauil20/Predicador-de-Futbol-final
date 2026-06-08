import { useState } from "react";
import PartidosTop from "../components/PartidosTop";
import ComentariosPartido from "../components/ComentariosPartido";
import ForoMini from "../components/ForoMini";
import Normas from "../components/Normas"; 

export default function Comentarios() {
  const [partido, setPartido] = useState(null);

  return (
    <div className="pagina">

      <h1 className="titulo">🔥 Partidos TOP</h1>

      <PartidosTop setPartido={setPartido} />

      <div className="zona-inferior">

        <div className="foro-grande">
          <ForoMini />
        </div>

        <div className="comentarios-grande">
          <ComentariosPartido partido={partido} />
        </div>

      </div>

      
      <Normas />

    </div>
  );
}