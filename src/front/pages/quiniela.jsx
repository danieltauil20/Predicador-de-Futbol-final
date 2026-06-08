import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TeamForm } from '../components/TeamForm';
import { footballService } from '../services/footballService';
import { predictionService } from '../services/predictionService';
import { RulesCard } from '../components/RulesCard';
import '../quiniela.css';

export const Quiniela = () => {
  // === ESTADOS (Memoria de la aplicación) ===
  const [fixtures, setFixtures] = useState([]);
  const [teamForms, setTeamForms] = useState({});
  const [predictions, setPredictions] = useState({});
  const [collapsedLeagues, setCollapsedLeagues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStats, setActiveStats] = useState({});
  const [loadingStats, setLoadingStats] = useState({});
  const [submittingStatus, setSubmittingStatus] = useState({});

  // === EFECTOS SECUNDARIOS ===
  useEffect(() => {
    const loadWeeklyFixtures = async () => {
      try {
        setLoading(true); // Encendemos la pantalla de "Cargando..."
        const { matches, forms } = await footballService.getWeeklyEliteFixtures();
        setFixtures(matches || []);
        setTeamForms(forms || {});
      } catch (err) {
        setError("No se pudieron sincronizar los partidos de la jornada semanal.");
      } finally {
        setLoading(false); // Apagamos el "Cargando..." pase lo que pase
      }
    };

    loadWeeklyFixtures();
  }, []);

  // === FUNCIONES DE ACCIÓN (Interacción del usuario) ===
  const handleToggleStats = useCallback(async (fixtureId, teamHomeId, teamAwayId) => {
    if (activeStats[fixtureId]) {
      setActiveStats(prev => ({ ...prev, [fixtureId]: null }));
      return;
    }

    setLoadingStats(prev => ({ ...prev, [fixtureId]: true }));
    try {
      const summary = await footballService.getH2HSummary(fixtureId, teamHomeId, teamAwayId);
      setActiveStats(prev => ({ ...prev, [fixtureId]: summary }));
    } catch (err) {
      console.error(`[H2H Error] Fallo al cargar estadísticas:`, err);
    } finally {
      setLoadingStats(prev => ({ ...prev, [fixtureId]: false }));
    }
  }, [activeStats]);

  const handlePredictionChange = useCallback((fixtureId, type, value) => {
    const parsedValue = value === "" ? "" : parseInt(value, 10);
    
    setPredictions(prev => {
      // 1. Tomamos lo que ya existía, o si es nuevo, inicializamos ambos en vacío
      const current = prev[fixtureId] || { home: "", away: "" };
      
      return {
        ...prev,
        [fixtureId]: { 
           ...current, 
           [type]: parsedValue 
        }
      };
    });
  }, []);

  const handleSendSinglePrediction = async (fixtureId) => {
    const matchPrediction = predictions[fixtureId];

    if (!matchPrediction || matchPrediction.home === undefined || matchPrediction.away === undefined) {
      alert("Por favor, introduce ambos marcadores antes de enviar.");
      return;
    }

    setSubmittingStatus(prev => ({ ...prev, [fixtureId]: 'loading' }));
    try {
      await predictionService.submit({
        fixtureId,
        homeGoals: matchPrediction.home,
        awayGoals: matchPrediction.away
      });
      setSubmittingStatus(prev => ({ ...prev, [fixtureId]: 'success' }));
      setTimeout(() => setSubmittingStatus(prev => ({ ...prev, [fixtureId]: null })), 3000);
    } catch (err) {
      setSubmittingStatus(prev => ({ ...prev, [fixtureId]: 'error' }));
    }
  };

  const getButtonClass = (status) => {
    const baseClass = 'gt-btn-atomic';
    if (!status) return baseClass;
    return `${baseClass} ${status}`;
  };

  const toggleLeague = (leagueName) => {
    setCollapsedLeagues(prev => ({
      ...prev,
      [leagueName]: !prev[leagueName]
    }));
  };

  // === PANTALLAS DE INTERRUPCIÓN ===
  if (loading) return <div className="gt-loader">Cargando cartelera de élite semanal y estados de forma...</div>;
  if (error) return <div className="gt-error-container">{error}</div>;

  // === LÓGICA PRE-RENDER: Agrupador de Ligas ===
  const groupedFixtures = fixtures.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = { flag: match.league.flag, matches: [] };
    }
    acc[leagueName].matches.push(match);
    return acc;
  }, {});

  // === RENDER PRINCIPAL DEL COMPONENTE ===
  return (
    <div className="gt-quiniela-container">
      <header className="gt-header">
        <h1 className="gt-title">GOAL <span>HUB</span></h1>
        <p className="gt-subtitle">La Quiniela Inteligente</p>
        <RulesCard /> 
        <div className="gt-header-actions">
          <Link to="/ranking" className="gt-btn-ranking">
            🏆 Ver Ranking Global
          </Link>
        </div>
      </header>

      <div className="gt-leagues-container">
        {!fixtures || fixtures.length === 0 ? (
          <p className="gt-no-matches">No hay partidos de élite programados para los próximos días.</p>
        ) : (
          Object.keys(groupedFixtures).map(leagueName => {
            const group = groupedFixtures[leagueName];
            const isCollapsed = collapsedLeagues[leagueName];

            return (
              <div key={leagueName} className="gt-league-section">

                {/* CABECERA: Botón interactivo para cerrar/abrir la liga */}
                <div className="gt-league-header" onClick={() => toggleLeague(leagueName)}>
                  <div className="gt-league-header-title">
                    {group.flag && <img src={group.flag} alt="Bandera" className="gt-flag" />}
                    <h2>{leagueName}</h2>
                  </div>
                  <span className="gt-league-toggle-icon">
                    {isCollapsed ? '▼' : '▲'}
                  </span>
                </div>

                {/* CONTENIDO DE LA LIGA */}
                {!isCollapsed && (
                  <div className="gt-fixtures-grid animate-fade-in">
                    {group.matches.map(match => {
                      const fId = match.fixture.id;
                      const currentMatchPred = predictions[fId] || { home: "", away: "" };
                      const status = submittingStatus[fId];
                      const statusShort = match.fixture.status.short;

                      const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(statusShort);
                      const isFinished = ['FT', 'AET', 'PEN'].includes(statusShort);

                      // Formato de fecha completa actualizado
                      const matchDateObj = new Date(match.fixture.date);
                      const matchDay = matchDateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                      const matchTime = matchDateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div key={fId} className="gt-card">

                          {/* FILA DE ESTADO */}
                          <div className="gt-card-status-row">
                            <div className="gt-time-status-container">
                              {isLive ? (
                                <span className="gt-badge-live">
                                  <span className="gt-pulse-dot"></span> EN VIVO ({match.fixture.status.elapsed}')
                                </span>
                              ) : isFinished ? (
                                <span className="gt-badge-finished">🏁 FINALIZADO</span>
                              ) : (
                                <span className="gt-badge-time">📅 {matchDay} - ⏰ {matchTime}</span>
                              )}
                            </div>
                          </div>

                          {/* FILA PRINCIPAL: Equipos y Cajas de Predicción */}
                          <div className="gt-match-core">
                            <div className="gt-team local">
                              <img src={match.teams.home.logo} alt="" className="gt-team-logo" />

                              {/* CAJÓN DEL EQUIPO LOCAL (Apila Nombre + Racha/NA) */}
                              <div className="gt-team-info local-info">
                                <span className="gt-team-name">{match.teams.home.name}</span>
                                <TeamForm formString={teamForms?.[match.teams.home.id] || ""} />
                              </div>

                              {!isFinished && (
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  className="gt-input-score"
                                  value={currentMatchPred.home}
                                  onChange={(e) => handlePredictionChange(fId, 'home', e.target.value)}
                                  disabled={status === 'loading' || status === 'success'}
                                />
                              )}
                            </div>

                            <div className="gt-vs">VS</div>

                            <div className="gt-team away">
                              {!isFinished && (
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  className="gt-input-score"
                                  value={currentMatchPred.away}
                                  onChange={(e) => handlePredictionChange(fId, 'away', e.target.value)}
                                  disabled={status === 'loading' || status === 'success'}
                                />
                              )}

                              {/* CAJÓN DEL EQUIPO VISITANTE (Apila Nombre + Racha/NA) */}
                              <div className="gt-team-info away-info">
                                <span className="gt-team-name">{match.teams.away.name}</span>
                                <TeamForm formString={teamForms?.[match.teams.away.id] || ""} />
                              </div>

                              <img src={match.teams.away.logo} alt="" className="gt-team-logo" />
                            </div>
                          </div>

                          {/* REVELACIÓN FINAL: Se muestra solo si el partido acabó */}
                          {isFinished && (
                            <div className="gt-prediction-result">
                              <div className="gt-real-score">
                                Marcador Final: {match.score?.fullTime?.home ?? '?'} - {match.score?.fullTime?.away ?? '?'}
                              </div>
                              {currentMatchPred.points !== undefined ? (
                                <div className={`gt-points-badge ${currentMatchPred.points === 3 ? 'gt-points-perfect' : 'gt-points-partial'}`}>
                                  +{currentMatchPred.points} Pts ganados
                                </div>
                              ) : (
                                <span className="gt-missed">No hiciste predicción para este partido</span>
                              )}
                            </div>
                          )}

                          {/* BOTÓN ESTADÍSTICAS: Activa el H2H */}
                          <div className="gt-stats-trigger-zone">
                            <button
                              type="button"
                              className={`gt-btn-stats-toggle ${activeStats[fId] ? 'active' : ''}`}
                              onClick={() => handleToggleStats(fId, match.teams.home.id, match.teams.away.id)}
                            >
                              {loadingStats[fId] ? (
                                <><span className="gt-spinner-mini"></span> Analizando tendencias...</>
                              ) : activeStats[fId] ? (
                                '▲ Ocultar Historial'
                              ) : (
                                '📊 Ver Historial'
                              )}
                            </button>
                          </div>

                          {/* PANEL DE ESTADÍSTICAS (Oculto por defecto) */}
                          {/* PANEL DE ESTADÍSTICAS CON BARRA DE PROBABILIDAD */}
                          {activeStats[fId] && (() => {
                            // Algoritmo matemático para sacar las probabilidades basado en el historial
                            const stats = activeStats[fId];
                            let homeProb = 33, drawProb = 34, awayProb = 33; // Si nunca han jugado, 33% a todos

                            if (stats.total > 0) {
                              homeProb = Math.round((stats.homeWins / stats.total) * 100);
                              drawProb = Math.round((stats.draws / stats.total) * 100);
                              awayProb = 100 - homeProb - drawProb; // Garantiza sumar 100%
                            }

                            return (
                              <div className="gt-stats-panel animate-fade-in">
                                <div className="gt-stats-title">Últimos {stats.total} enfrentamientos directos:</div>

                                {/* NUEVO: La Barra Predictiva Neón */}
                                <div className="gt-prob-container">
                                  <div className="gt-prob-labels">
                                    <span style={{ color: 'var(--neon-cyan)' }}>{homeProb}% Local</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{drawProb}% Empate</span>
                                    <span style={{ color: 'var(--error-red)' }}>{awayProb}% Visita</span>
                                  </div>
                                  <div className="gt-prob-bar">
                                    <div className="gt-prob-segment prob-home" style={{ width: `${homeProb}%` }}></div>
                                    <div className="gt-prob-segment prob-draw" style={{ width: `${drawProb}%` }}></div>
                                    <div className="gt-prob-segment prob-away" style={{ width: `${awayProb}%` }}></div>
                                  </div>
                                </div>

                                <div className="gt-stats-bars" style={{ marginTop: '15px' }}>
                                  <div className="gt-stat-bar-item">
                                    <span className="gt-stat-label">Victorias {match.teams.home.name}:</span>
                                    <span className="gt-stat-val">{stats.homeWins}</span>
                                  </div>
                                  <div className="gt-stat-bar-item">
                                    <span className="gt-stat-label">Empates:</span>
                                    <span className="gt-stat-val">{stats.draws}</span>
                                  </div>
                                  <div className="gt-stat-bar-item">
                                    <span className="gt-stat-label">Victorias {match.teams.away.name}:</span>
                                    <span className="gt-stat-val">{stats.awayWins}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* BOTONERA: Ver más detalles de liga / Enviar Predicción */}
                          <div className="gt-action-area">
                            <Link to={`/liga/${encodeURIComponent(leagueName.toLowerCase().replace(/ /g, "-"))}`} className="gt-btn-secondary">
                              Detalles
                            </Link>
                            {!isFinished && (
                              <button
                                className={getButtonClass(status)}
                                onClick={() => handleSendSinglePrediction(fId)}
                                disabled={status === 'loading' || status === 'success'}
                              >
                                {status === 'loading' && 'Guardando...'}
                                {status === 'success' && '✓ Guardado'}
                                {status === 'error' && '⚡ Reintentar'}
                                {!status && 'Enviar Predicción'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
