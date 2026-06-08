import { useEffect, useState } from "react";

export default function ProfileModal({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);

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

    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (currentUser) {
      let users = JSON.parse(localStorage.getItem("users")) || [];

      const index = users.findIndex(u => u.username === currentUser.username);

      if (index !== -1) users[index] = currentUser;
      else users.push(currentUser);

      localStorage.setItem("users", JSON.stringify(users));
    }

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

    const updatedUser = {
      ...user,
      teams: updatedTeams
    };

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
      const updatedUser = {
        ...user,
        photo: reader.result
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const index = users.findIndex(u => u.username === updatedUser.username);

      if (index !== -1) users[index] = updatedUser;

      localStorage.setItem("users", JSON.stringify(users));

      window.dispatchEvent(new Event("userUpdated"));
    };

    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("session");
    window.location.reload();
  };

  const leagues = {
    "🇪🇸 LaLiga": ["Real Madrid", "Barcelona", "Atlético", "Sevilla"],
    "🏴 Premier League": ["Man City", "Liverpool", "Arsenal", "Chelsea"],
    "🇮🇹 Serie A": ["Juventus", "Milan", "Inter", "AC Roma"]
  };

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
              user.username.charAt(0).toUpperCase()
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
            <h3>{user.username}</h3>
            <p>{user.points || 0} puntos</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="section">
          <p className="title">Equipos favoritos</p>

          {Object.entries(leagues).map(([league, teamList]) => (
            <div key={league} className="league">
              <p className="league-title">{league}</p>

              <div className="chips">
                {teamList.map(team => (
                  <span
                    key={team}
                    className={`team-chip ${teams.includes(team) ? "active" : ""}`}
                    onClick={() => toggleTeam(team)}
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="divider"></div>

        <div className="section">
          <p className="title">🏆 Ranking</p>

          {(() => {
            const users = JSON.parse(localStorage.getItem("users")) || [];

            const sorted = [...users].sort(
              (a, b) => (b.points || 0) - (a.points || 0)
            );

            return sorted.length > 0 ? (
              sorted.map((u, i) => (
                <div
                  key={i}
                  className={`ranking-item ${
                    i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : ""
                  }`}
                >
                  <span>
                    {i === 0 && "🥇"}
                    {i === 1 && "🥈"}
                    {i === 2 && "🥉"}
                    #{i + 1} {u.username}
                  </span>

                  <span>{u.points || 0} pts</span>
                </div>
              ))
            ) : (
              <small>No hay ranking aún</small>
            );
          })()}
        </div>

        <button className="logout" onClick={logout}>
          Cerrar sesión
        </button>

      </div>
    </div>
  );
}
