import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Body } from "../components/Body";

// Tus importaciones de logotipos
import laliga from "../assets/logos/laliga.png";
import premierleague from "../assets/logos/premierleague.png";
import seriea from "../assets/logos/seriea.png";
import bundesliga from "../assets/logos/bundesliga.png";

export const Home = () => {
  const navigate = useNavigate();

  // Estructura de las ligas con nombres completos
  const ligas = [
    { id: "la-liga", logo: laliga, title: "La Liga", country: "España" },
    { id: "premier", logo: premierleague, title: "Premier League", country: "Inglaterra" },
    { id: "serie-a", logo: seriea, title: "Serie A", country: "Italia" },
    { id: "bundesliga", logo: bundesliga, title: "Bundesliga", country: "Alemania" },
  ];

  const handleNavigate = (id) => {
    navigate(`/liga/${id}`);
  };

  return (
    <div className="pagina text-center mt-5">
      {/* Selector de Liga Encabezado */}
      <div className="league-header">
      </div>

      {/* Contenedor de Tarjetas de Ligas */}
      <div className="cards-container">
        {ligas.map((liga, index) => (
          <div
            key={index}
            onClick={() => handleNavigate(liga.id)}
            style={{ cursor: "pointer" }}
          >
            <Card {...liga} />
          </div>
        ))}
      </div>

      {/* Componente Body que renderiza los paneles inferiores (Foro, Partidos, Comentarios) */}
      <Body />
    </div>
  );
};