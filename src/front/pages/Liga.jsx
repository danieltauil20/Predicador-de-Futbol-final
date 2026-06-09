import { useParams } from "react-router-dom";
import { ListaPartidos } from "../components/ListaPartidos"; 

export const Liga = () => {
  const { nombre } = useParams(); // Ejemplo: "la-liga", "premier-league"

  // Diccionario para mostrar los nombres de las ligas perfectamente formateados
  const nombresLigas = {
    "la-liga": "LaLiga EA Sports",
    "premier-league": "Premier League",
    "serie-a": "Serie A TIM",
    "bundesliga": "Bundesliga",
  };

  // Si no encuentra la liga en el diccionario, limpia el guion por si acaso
  const nombreLimpio = nombresLigas[nombre] || nombre.replace("-", " ");

  return (
    <div className="pagina-liga" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}> 
      
      {/* Cabecera optimizada para máxima legibilidad */}
      <header className="league-header" style={{ textAlign: "center", margin: "40px 0 20px" }}>
        <h1 
          className="league-title" 
          style={{
            color: "#ffffff",                 // Blanco puro brillante
            fontSize: "3rem",                 // Tamaño grande e imponente
            fontWeight: "800",                // Súper negrita
            letterSpacing: "2px",             // Espaciado premium entre letras
            textTransform: "uppercase",       // Forzado a mayúsculas estilizadas
            margin: 0,
            textShadow: "0 4px 15px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)" // Doble sombra para que flote sobre cualquier fondo verde
          }}
        >
          {nombreLimpio}
        </h1>
      </header>

      {/* La 'key' fuerza la animación cada vez que cambia el 'nombre' */}
      <div key={nombre} className="fade-transition">
        <ListaPartidos ligaId={nombre} /> 
      </div>
      
    </div>
  );
};

export default Liga;