import { Body } from "../components/Body";
import { Card } from "../components/Card";

import laliga from "../assets/logos/laliga.png";
import premierleague from "../assets/logos/premierleague.png";
import seriea from "../assets/logos/seriea.png";
import bundesliga from "../assets/logos/bundesliga.png";
import worldcup from "../assets/logos/worldcup.png";

export const Home = () => {
  const ligas = [
    { logo: laliga, title: "La Liga", country: "España" }, // El campo 'country' es clave
    { logo: premierleague, title: "Premier League", country: "Inglaterra" },
    { logo: seriea, title: "Serie A", country: "Italia" },
    { logo: bundesliga, title: "Bundesliga", country: "Alemania" },
  ];

  return (
    <div className="text-center mt-5">
      <div className="cards-container">
        {ligas.map((liga, index) => (
          <Card key={index} {...liga} />
        ))}
      </div>

      <Body />
    </div>
  );
};