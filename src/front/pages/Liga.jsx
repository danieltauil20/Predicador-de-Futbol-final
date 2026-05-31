import { useParams } from "react-router-dom";
import { ListaPartidos } from "../components/ListaPartidos"; 

export const Liga = () => {
  const { nombre } = useParams(); // Ejemplo: "la-liga"

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1>{nombre.replace("-", " ").toUpperCase()}</h1>
      {/* Aquí llamamos al componente de partidos */}
      <ListaPartidos ligaId={nombre} /> 
    </div>
  );
};