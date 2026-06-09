import { useState } from "react";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError("");

    if (!password || (!isLogin && (!username || !email)) || (isLogin && !email)) {
      setError("Completa todos los campos");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    if (!isLogin) {
      // Lógica de Registro
      const newUser = {
        username,
        email,
        password,
        teams: [],
        points: 30,
        predictions: []
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("session", "true");

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const index = users.findIndex(u => u.username === newUser.username);

      if (index !== -1) {
        users[index] = newUser;
      } else {
        users.push(newUser);
      }

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("justRegistered", "true");

      onClose();
      if (onLoginSuccess) onLoginSuccess();

    } else {
      // Lógica de Inicio de Sesión
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (
        savedUser &&
        savedUser.email === email &&
        savedUser.password === password
      ) {
        localStorage.setItem("session", "true");
        onClose();
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError("Email o contraseña incorrectos");
        return;
      }
    }

    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Pestañas Superiores (Controlan exclusivamente la vista) */}
        <div className="tabs">
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Registro
          </button>

          <button
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Iniciar sesión
          </button>
        </div>

        {/* Inputs del Formulario */}
        <div className="form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña (6+ caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error" style={{ color: "#ef4444", fontSize: "13px", margin: "5px 0 0" }}>{error}</p>}
        </div>

        {/* 🟢 BOTONES INFERIORES: Cancelar y Continuar en Paralelo y con Libertad */}
        <div className="modal-actions-grid">
          <button 
            type="button" 
            className="btn-auth" 
            onClick={onClose}
            style={{ background: "#1e293b", color: "#94a3b8" }} // Tono oscuro neutro por defecto
          >
            Cancelar
          </button>

          <button 
            type="button" 
            className="btn-auth" 
            onClick={handleSubmit}
            style={{ background: "#22c55e", color: "#020617", fontWeight: "800" }} // El botón de acción principal resalta en verde
          >
            Continuar
          </button>
        </div>

      </div>
    </div>
  );
}