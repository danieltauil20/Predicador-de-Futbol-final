import { useParams } from "react-router-dom";
import { ListaPartidos } from "../components/ListaPartidos"; 

export const Liga = () => {
  const { nombre } = useParams(); // Ejemplo: "la-liga"

  return (
    /* He quitado tu style en línea y lo dejamos manejado por las clases que añadiremos al CSS */
    <div className="pagina-liga"> 
      
      {/* Nueva cabecera centrada */}
      <header className="league-header">
        <h1 className="league-title">{nombre.replace("-", " ").toUpperCase()}</h1>
      </header>

      {/* La 'key' fuerza la animación cada vez que cambia el 'nombre' */}
      <div key={nombre} className="fade-transition">
        <ListaPartidos ligaId={nombre} /> 
      </div>
      
    </div>
  );
};