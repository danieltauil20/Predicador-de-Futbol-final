import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NewsCarousel } from "./NewsCarousel";
import "../body.css";
import "../index.css";

export const Body = () => {
    // 1. Inicializamos el hook de React Router para navegación imperativa
    const navigate = useNavigate();

    // 2. Estado local para almacenar las métricas del Backend
    const [userStats, setUserStats] = useState({ total: 0, online: 0 });

    // 3. Obtener estadísticas reales desde la API de Flask
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                if (response.ok) {
                    const data = await response.json();
                    setUserStats(data);
                }
            } catch (err) {
                console.error("Error al cargar las estadísticas:", err);
            }
        };

        fetchStats();
    }, []);

    // 4. Base de datos simulada de partidos (puedes expandirla o conectarla a tu API)
    const partidosFicticios = [
        { local: "Real Madrid", visitante: "Barcelona", golesLocal: 2, golesVisita: 1, jugado: true, logoLocal: "https://creativetacos.com/wp-content/uploads/2024/02/Real-Madrid-Logo.png", logoVisita: "https://creativetacos.com/wp-content/uploads/2024/02/FC-Barcelona-Logo.png" },
        { local: "Manchester City", visitante: "Liverpool", golesLocal: undefined, golesVisita: undefined, jugado: false, logoLocal: "https://creativetacos.com/wp-content/uploads/2024/02/Manchester-City-FC-Logo.png", logoVisita: "https://creativetacos.com/wp-content/uploads/2024/02/Liverpool-FC-Logo.png" },
        { local: "Bayern Múnich", visitante: "Borussia Dortmund", golesLocal: 3, golesVisita: 3, jugado: true, logoLocal: "https://creativetacos.com/wp-content/uploads/2024/02/Bayern-Munich-Logo.png", logoVisita: "https://creativetacos.com/wp-content/uploads/2024/02/Borussia-Dortmund-Logo.png" },
        { local: "Juventus", visitante: "Inter de Milán", golesLocal: undefined, golesVisita: undefined, jugado: false, logoLocal: "https://creativetacos.com/wp-content/uploads/2024/02/Juventus-FC-Logo.png", logoVisita: "https://creativetacos.com/wp-content/uploads/2024/02/Inter-Milan-Logo.png" }
    ];

    // 5. Arquitectura de datos de las tarjetas superiores
    const features = [
        { id: "usuarios", title: "Usuarios", icon: "👥", description: "Gestión de perfiles y estadísticas.", path: null },
        { id: "predicciones", title: "Predicciones", icon: "🏆", description: "Sigue las ligas y suma puntos.", path: "/quiniela" },
        { id: "comentarios", title: "Comentarios", icon: "💬", description: "Debate en tiempo real.", path: "/comentarios" }
    ];

    const handleCardClick = (path) => {
        if (path) navigate(path);
    };

    return (
        <div className="main-content">
            <h1 className="hero-title">Temporada 2026/27</h1>
            <h2 className="hero-subtitle">Tu portal definitivo de fútbol europeo</h2>
            <p className="feature-text">Sigue las mejores ligas, haz predicciones, compite con amigos y vive cada gol como si estuvieras en el estadio.</p>
            {/* AQUÍ INYECTAMOS NUESTRO NUEVO CARRUSEL */}
            <NewsCarousel />

            {/* Rejilla de características superior */}
            <div className="features-grid">
                {features.map((item) => (
                    <div
                        className={`feature-card ${item.path ? "clickable-card" : ""}`}
                        key={item.id}
                        onClick={() => handleCardClick(item.path)}
                        style={{ cursor: item.path ? "pointer" : "default" }}
                    >
                        <div className="feature-icon">{item.icon}</div>
                        <h3 className="feature-name">{item.title}</h3>
                        <p className="feature-text">{item.description}</p>

                        {/* 5. Renderizado del contador exclusivo de Usuarios con Clases limpias */}
                        {
                            item.id === "usuarios" && (
                                <div className="user-stats-container">
                                    <span className="user-stat-badge total">
                                        Total: <b>{userStats.total}</b>
                                    </span>
                                    <span className="user-stat-badge online">
                                        Online: <b>{userStats.online}</b> 🟢
                                    </span>
                                </div>
                            )
                        }
                    </div >
                ))}
            </div >

            {/* 🟢 NUEVO BLOQUE INFERIOR: PANEL DE PARTIDOS ESTILO COMENTARIOS */}
            < div className="zona-inferior" style={{ marginTop: "50px" }}>
                <div className="partidos-grande">
                    <h2>Próximos Partidos</h2>
                    <div className="lista-partidos">
                        {partidosFicticios.map((partido, index) => (
                            <div key={index} className="card-partido">
                                <div className="equipos">

                                    {/* Equipo Local */}
                                    <div className="equipo">
                                        <img src={partido.logoLocal} alt={partido.local} onError={(e) => e.target.style.display = 'none'} />
                                        <p>{partido.local}</p>
                                    </div>

                                    {/* Contenedor central (Marcador o VS) */}
                                    <div className="vs-container">
                                        {partido.jugado ? (
                                            <span className="score-box-center">
                                                {partido.golesLocal} - {partido.golesVisita}
                                            </span>
                                        ) : (
                                            <span className="vs">VS</span>
                                        )}
                                    </div>

                                    {/* Equipo Visitante */}
                                    <div className="equipo">
                                        <img src={partido.logoVisita} alt={partido.visitante} onError={(e) => e.target.style.display = 'none'} />
                                        <p>{partido.visitante}</p>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </div >
    );
};