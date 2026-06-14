import { useState } from "react";
import { useGlobalReducer } from "../hooks/useGlobalReducer.jsx";
export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  // 🔥 Traemos el despachador de acciones (store global)
  const { dispatch } = useGlobalReducer();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async () => {
    setError("");
    if (!password || (!isLogin && (!username || !email))) {
      setError("Completa todos los campos");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    // 🔥 URL Dinámica del Backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    try {
      if (!isLogin) {
        // ==========================================
        // 🔥 PETICIÓN DE REGISTRO (SIGNUP)
        // ==========================================
        const response = await fetch(`${backendUrl}/api/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.msg || "Error en el registro");
          setLoading(false);
          return;
        }
        // ¡Éxito! Lo mandamos a la pestaña de Iniciar Sesión automáticamente
        setIsLogin(true);
        setError("✅ ¡Cuenta creada! Ahora inicia sesión.");
        setUsername("");
        setPassword("");
        setLoading(false);
      } else {
        // ==========================================
        // 🔥 PETICIÓN DE LOGIN (INICIAR SESIÓN)
        // ==========================================
        const response = await fetch(`${backendUrl}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.msg || "Error al iniciar sesión");
          setLoading(false);
          return;
        }
        // ¡Éxito! Inyectamos el Token JWT y el Usuario a tu Bóveda Central (store.js)
        dispatch({
          type: "login",
          payload: {
            token: data.access_token,
            user: data.user
          }
        });
        onClose();
        if (onLoginSuccess) onLoginSuccess();
        
        setEmail("");
        setPassword("");
        setLoading(false);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="tabs">
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Registro
          </button>
          <button
            className={isLogin ? "active" : ""}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Iniciar sesión
          </button>
        </div>
        <div className="form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Contraseña (6+ caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && (
            <p className="error" style={{ color: error.includes("✅") ? "var(--neon-green)" : "var(--error-red)", fontSize: "13px", margin: "5px 0 0" }}>
              {error}
            </p>
          )}
        </div>
        <div className="modal-actions-grid" style={{ marginTop: "20px" }}>
          <button 
            className="btn-auth" 
            onClick={onClose} 
            disabled={loading}
            style={{ background: "#1e293b", color: "#94a3b8" }}
          >
            Cancelar
          </button>
          <button 
            className="btn-auth" 
            onClick={handleSubmit} 
            disabled={loading}
            style={{ background: "#22c55e", color: "#020617", fontWeight: "800" }}
          >
            {loading ? "Procesando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
