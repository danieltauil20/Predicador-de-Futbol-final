import { useNavigate } from "react-router-dom"; // 1. Importamos useNavigate
import { Card } from "../components/Card";
import { Body } from "../components/Body";

// Tus importaciones...
import laliga from "../assets/logos/laliga.png";
import premierleague from "../assets/logos/premierleague.png";
import seriea from "../assets/logos/seriea.png";
import bundesliga from "../assets/logos/bundesliga.png";

export const Home = () => {
  const navigate = useNavigate(); // 2. Inicializamos el hook

  const ligas = [
    { id: "la-liga", logo: laliga, title: "La Liga", country: "España" },
    { id: "premier", logo: premierleague, title: "Premier League", country: "Inglaterra" },
    { id: "serie-a", logo: seriea, title: "Serie A", country: "Italia" },
    { id: "bundesliga", logo: bundesliga, title: "Bundesliga", country: "Alemania" },
  ];

  // 3. Función para gestionar el clic
  const handleNavigate = (id) => {
    navigate(`/liga/${id}`);
  };

  return (
    <div className="text-center mt-5">
      <div className="cards-container" style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
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

      <Body />
    </div>
  );
};