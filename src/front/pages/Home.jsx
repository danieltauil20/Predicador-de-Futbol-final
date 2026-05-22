import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Body } from "../components/Body.jsx";
import { Card } from "../components/Card";

import laliga from "../assets/logos/laliga.png";
import premierleague from "../assets/logos/premierleague.png";
import seriea from "../assets/logos/seriea.png";
import bundesliga from "../assets/logos/bundesliga.png";
import worldcup from "../assets/logos/worldcup.png";

export const Home = () => {
	const ligas = [
		{ logo: laliga, title: "La Liga", country: "España", slug: "LaLiga" },
		{ logo: premierleague, title: "Premier League", country: "Inglaterra", slug: "Premier" },
		{ logo: seriea, title: "Serie A", country: "Italia", slug: "SerieA" },
		{ logo: bundesliga, title: "Bundesliga", country: "Alemania", slug: "Bundesliga" },
		{ logo: worldcup, title: "Mundial 2026", country: "FIFA", slug: "WorldCup" }
	];

	return (
		<div className="text-center mt-5">
			<div className="cards-container">
				{ligas.map((liga, index) => (
					<Card key={index} {...liga} />
				))}
			</div>
			{Body}
			<Body />

			{/* <div className="alert alert-info mt-4">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Conectando con el servidor de la liga... ⚽
					</span>
				)}
			</div> */}
		</div>

	);
};