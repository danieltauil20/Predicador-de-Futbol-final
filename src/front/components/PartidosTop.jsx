import { useEffect, useState } from "react";
import { getPartidos } from "../services/api";

export default function PartidosTop({ setPartido }) {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getPartidos();
        console.log("DATOS API:", data);

        if (data && data.length > 0) {
          setPartidos(data.slice(0, 6));
        } else {
          fallback();
        }
      } catch (error) {
        console.error("ERROR API:", error);
        fallback();
      } finally {
        setLoading(false);
      }
    };

    const fallback = () => {
      setPartidos([
        {
          id: 1,
          home: "Real Madrid",
          away: "Barcelona",
          homeLogo: "https://crests.football-data.org/86.png",
          awayLogo: "https://crests.football-data.org/81.png",
        },
        {
          id: 2,
          home: "Manchester City",
          away: "Liverpool",
          homeLogo: "https://crests.football-data.org/65.png",
          awayLogo: "https://crests.football-data.org/64.png",
        },
        {
          id: 3,
          home: "PSG",
          away: "Bayern",
          homeLogo: "https://crests.football-data.org/524.png",
          awayLogo: "https://crests.football-data.org/5.png",
        },
        {
          id: 4,
          home: "Juventus",
          away: "Inter",
          homeLogo: "https://crests.football-data.org/109.png",
          awayLogo: "https://crests.football-data.org/108.png",
        },
        {
          id: 5,
          home: "Arsenal",
          away: "Chelsea",
          homeLogo: "https://crests.football-data.org/57.png",
          awayLogo: "https://crests.football-data.org/61.png",
        },
        {
          id: 6,
          home: "Milan",
          away: "Napoles",
          homeLogo: "https://crests.football-data.org/98.png",
          awayLogo: "https://crests.football-data.org/113.png",
        },
      ]);
    };

    cargar();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", color: "white" }}>Cargando partidos...</p>;
  }

  return (
    <div className="grid-partidos">
      <style>{`
        /* 🔴 REJILLA CORREGIDA: Fuerza a que se pongan uno al lado del otro */
        .grid-partidos {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* 🟢 Dos columnas fijas en PC */
          gap: 16px;
          margin-bottom: 5px;
          width: 100%;
        }

        /* Tarjeta individual de cada partido */
        .card-partido {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .card-partido:hover {
          transform: translateY(-3px);
          border-color: #0ee7ac;
          box-shadow: 0 8px 20px rgba(14, 231, 172, 0.15);
        }

        /* Contenedor Flex de los equipos */
        .equipos {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        /* Caja de cada equipo (Logo + Nombre) */
        .equipo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        /* CONTROL DE LOGOS */
        .equipo img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.15));
        }

        .equipo span {
          font-size: 0.85rem;
          color: #e2e8f0;
          font-weight: 600;
          text-align: center;
          /* 🟢 Quitamos white-space para que si el nombre es largo baje de línea y no rompa la caja */
          white-space: normal; 
        }

        /* Separador VS central */
        .vs {
          font-size: 0.8rem;
          font-weight: 800;
          color: #0ee7ac;
          padding: 0 10px;
          letter-spacing: 1px;
        }

        /* 📱 RESPONSIVO PARA MÓVILES EXTREMOS */
        @media (max-width: 480px) {
          .grid-partidos {
            grid-template-columns: 1fr; /* En móviles muy pequeños pasa a una sola fila */
          }
        }
      `}</style>

      {partidos.map((p, i) => {
        const homeName = p.teams ? p.teams.home.name : p.home;
        const awayName = p.teams ? p.teams.away.name : p.away;

        const homeLogo = p.teams ? p.teams.home.logo : p.homeLogo;
        const awayLogo = p.teams ? p.teams.away.logo : p.awayLogo;

        return (
          <div
            key={i}
            className="card-partido"
            onClick={() => setPartido(p)}
          >
            <div className="equipos">

              <div className="equipo">
                <img src={homeLogo} alt={homeName} />
                <span>{homeName}</span>
              </div>

              <span className="vs">VS</span>

              <div className="equipo">
                <img src={awayLogo} alt={awayName} />
                <span>{awayName}</span>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
