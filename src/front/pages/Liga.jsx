import { useParams } from "react-router-dom";
import { TablaPosiciones } from "../components/TablaPosiciones";

export const Liga = () => {
  const { nombre } = useParams();

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
      </div>
    </div>
  );
};