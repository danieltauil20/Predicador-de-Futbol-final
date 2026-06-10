import { useEffect, useState } from "react";
import { predictionService } from "../services/predictionService"; 

export default function ProfileModal({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [history, setHistory] = useState([]); 

  useEffect(() => {
    if (!isOpen) return;

    const loadUser = () => {
      const saved = JSON.parse(localStorage.getItem("user"));
      if (saved) {
        setUser(saved);
        setTeams(saved.teams || []);
      }
    };
    loadUser();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    fetch(`${backendUrl}/api/ranking?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setRanking(data))
      .catch(err => console.error("Error al cargar ranking:", err));

    predictionService.getHistory().then(data => setHistory(data));

    window.addEventListener("userUpdated", loadUser);
    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const toggleTeam = (team) => {
    let updatedTeams = teams.includes(team)
      ? teams.filter(t => t !== team)
      : [...teams, team];

    const updatedUser = { ...user, teams: updatedTeams };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setTeams(updatedTeams);
    setUser(updatedUser);
    window.dispatchEvent(new Event("userUpdated"));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, photo: reader.result };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("userUpdated"));
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const leagues = {
    "🇪🇸 LaLiga": ["Real Madrid", "Barcelona", "Atlético", "Sevilla"],
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League": ["Man City", "Liverpool", "Arsenal", "Chelsea"],
    "🇮🇹 Serie A": ["Juventus", "Milan", "Inter", "AC Roma"]
  };

  const myRankingData = ranking.find(r => r.user_id === user.id) || ranking.find(r => r.username === (user.username || user.email?.split('@')[0]));
  const realPoints = myRankingData ? myRankingData.points : 30;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>

        <div className="header">
          <h2>Mi Perfil</h2>
          <span className="close" onClick={onClose}>✕</span>
        </div>

        <div className="user-box">
          <div
            className="avatar"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {user.photo ? (
              <img src={user.photo} alt="avatar" />
            ) : (
              (user.username || user.email || "?").charAt(0).toUpperCase()
            )}
          </div>

          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImage}
          />

          <div className="user-info">
            <h3>{user.username || user.email}</h3>
            <p>{realPoints} puntos</p>
            
            {teams.length > 0 && (
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
                {teams.map(t => (
                  <span key={t} style={{ background: 'var(--neon-green)', color: 'black', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="divider"></div>

        <div className="section">
          <p className="title">⚽ Mi Historial de Predicciones</p>
          
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
              {history.map(pred => (
                <div key={pred.id} style={{ background: '#1c1c1c', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                     {pred.home_team_logo && <img src={pred.home_team_logo} width="20" alt="logo" />}
                     <span style={{ color: '#fff' }}>{pred.home_goals}</span>
                     <span style={{ color: 'var(--text-muted)' }}>-</span>
                     <span style={{ color: '#fff' }}>{pred.away_goals}</span>
                     {pred.away_team_logo && <img src={pred.away_team_logo} width="20" alt="logo" />}
                  </div>

                  <div>
                     {pred.points_earned === null ? (
                        <span style={{ color: 'gray', fontSize: '0.8rem', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>Pendiente</span>
                     ) : pred.points_earned === 3 ? (
                        <span style={{ color: 'black', background: 'var(--neon-green)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>+3 Pts</span>
                     ) : pred.points_earned === 1 ? (
                        <span style={{ color: 'black', background: 'var(--neon-cyan)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>+1 Pts</span>
                     ) : (
                        <span style={{ color: 'white', background: 'var(--error-red)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>0 Pts</span>
                     )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <small>Aún no has hecho ninguna predicción.</small>
          )}
        </div>

        <div className="divider"></div>

        <div className="section">
          <p className="title">🏆 Ranking Oficial (Top 5)</p>
          {ranking.length > 0 ? (
            ranking.slice(0, 5).map((u, i) => (
              <div
                key={u.user_id || i}
                className={`ranking-item ${
                  i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : ""
                }`}
              >
                <span>
                  {i === 0 && "🥇"}
                  {i === 1 && "🥈"}
                  {i === 2 && "🥉"}
                  #{u.rank} {u.username}
                </span>
                <span>{u.points} pts</span>
              </div>
            ))
          ) : (
            <small>Cargando ranking del servidor...</small>
          )}
        </div>

        <div className="divider"></div>

        <div className="section">
          <p className="title">Equipos favoritos</p>
          {Object.entries(leagues).map(([league, teamList]) => {
            const flag = league.split(' ')[0];
            const name = league.substring(flag.length).trim();
            
            return (
              <div key={league} className="league">
                <p className="league-title">
                  <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>{flag}</span> 
                  {name}
                </p>
                <div className="chips">
                  {teamList.map(team => (
                    <span
                      key={team}
                      className={`team-chip ${teams.includes(team) ? "active" : ""}`}
                      onClick={() => toggleTeam(team)}
                    >
                      {team} {teams.includes(team) ? "❤️" : ""}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <button className="logout" style={{ marginTop: '15px' }} onClick={logout}>
          Cerrar sesión
        </button>

      </div>
    </div>
  );
}