import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
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

    // 4. Arquitectura de datos
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
                        {item.id === "usuarios" && (
                            <div className="user-stats-container">
                                <span className="user-stat-badge total">
                                    Total: <b>{userStats.total}</b>
                                </span>
                                <span className="user-stat-badge online">
                                    Online: <b>{userStats.online}</b> 🟢
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};