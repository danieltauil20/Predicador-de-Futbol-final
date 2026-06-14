import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RulesCard } from '../components/RulesCard';
import {useGlobalReducer} from '../hooks/useGlobalReducer';
import '../Ranking.css';

export const Ranking = () => {
  const { store } = useGlobalReducer();
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const response = await fetch(`${backendUrl}/api/ranking?t=${new Date().getTime()}`);
      if (!response.ok) throw new Error("Error al cargar el ranking desde el servidor");
      const data = await response.json();

      console.log("🕵️ DETECTIVE REACT DICE:", data);

      setRankingData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  // Función para disparar al Bot Evaluador del Backend
  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const response = await fetch(`${backendUrl}/api/evaluate`, { method: 'POST' });
      const result = await response.json();
      alert(result.msg); // Mostramos el mensaje (ej. "Se evaluaron 5 predicciones nuevas")
      await fetchRanking(); // Recargamos el ranking para ver los nuevos puntos
    } catch (err) {
      alert("Error al intentar evaluar predicciones: " + err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRowClass = (rank) => {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "";
  };

  if (loading) return <div className="gt-loader">Calculando posiciones globales...</div>;
  if (error) return <div className="gt-error-container">{error}</div>;

  return (
    <div className="gt-ranking-container animate-fade-in">

      <div className="gt-ranking-header">
        <h1 className="gt-ranking-title"><span>RANKING</span> GLOBAL</h1>
        <RulesCard />
        <p className="gt-subtitle">Los mejores predictores de la temporada</p>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/quiniela" className="gt-btn-secondary">
            ← Volver a la Quiniela
          </Link>

          {/* NUEVO: Botón para llamar al Bot Evaluador */}
          <button
            onClick={handleEvaluate}
            disabled={evaluating}
            className="gt-btn-atomic"
            style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }}
          >
            {evaluating ? "Evaluando partidos..." : "⚡ Actualizar Puntuaciones"}
          </button>
        </div>
      </div>

      {rankingData.length === 0 ? (
        <div className="gt-no-matches">Aún no hay usuarios compitiendo en esta temporada. ¡Sé el primero en registrarte!</div>
      ) : (
        <div className="gt-ranking-list">
          {rankingData.map((user, index) => {
            // Evaluamos si el ID del ciclo coincide con el ID guardado en la sesión
            const isMe = store.user && store.user.id === user.user_id;

            return (
              <div
                key={user.user_id}
                className={`gt-ranking-card ${getRowClass(user.rank)} ${isMe ? 'is-me-card' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="gt-rank-position">{getMedal(user.rank)}</div>

                <div className="gt-rank-user">
                  {user.username}
                  {/* Etiqueta especial si soy yo */}
                  {isMe && <span className="gt-is-me-badge">Tú</span>}
                  {/* Corona si es el Top 1 */}
                  {user.rank === 1 && <span style={{ fontSize: '0.8rem', marginLeft: '5px' }}>👑</span>}
                </div>

                <div className="gt-rank-points">
                  {user.points} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PTS</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="gt-support-alert">
        ¿Problemas con tus predicciones o notas algún error? <br />
        Contacta a Soporte Técnico: <strong>+1 (555) 123-4567</strong> | <a href="mailto:soporte@quiniela.app">soporte@quiniela.app</a>
      </div>
    </div>
  );
};