import { useState, useEffect } from "react";
import ForoMini from "../components/ForoMini";

export default function ComentariosPartido({ partido }) {
  const [comentarios, setComentarios] = useState([
    { usuario: "Jose", texto: "viva el arsenal", likes: 0 },
    { usuario: "Jose", texto: "va a ganar por 5 puntos", likes: 1 },
    { usuario: "Rigo", texto: "viva el arsenal", likes: 3, top: true }
  ]);
  const [nuevo, setNuevo] = useState("");

  const enviar = () => {
    if (!nuevo.trim()) return;
    setComentarios([...comentarios, { usuario: "Jose", texto: nuevo, likes: 0 }]);
    setNuevo("");
  };

  const [usuario, setUsuario] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState("");

  useEffect(() => {
    if (!usuario) {
      setMostrarModal(true);
    }
  }, [usuario]);

  const guardarUsuario = () => {
    if (!nuevoUsuario.trim()) return;

    setUsuario(nuevoUsuario);
    setMostrarModal(false);
  };

  const partidoId = partido
    ? partido.teams
      ? partido.teams.home.name + "-" + partido.teams.away.name
      : partido.home + "-" + partido.away
    : null;

  useEffect(() => {
    if (!partidoId) return;

    const guardados = JSON.parse(localStorage.getItem("comentarios")) || {};
    setComentarios(guardados[partidoId] || []);
  }, [partidoId]);

  const guardarEnLocal = (nuevosComentarios) => {
    const guardados = JSON.parse(localStorage.getItem("comentarios")) || {};
    guardados[partidoId] = nuevosComentarios;
    localStorage.setItem("comentarios", JSON.stringify(guardados));
  };

  const agregar = () => {
    if (!nuevo.trim()) return; // Corregido 'texto' por 'nuevo' que es tu estado real

    const nuevos = [
      ...comentarios,
      {
        texto: nuevo,
        likes: 0,
        usuario: usuario
      }
    ];

    setComentarios(nuevos);
    guardarEnLocal(nuevos);
    setNuevo("");
  };

  const darLike = (index) => {
    const nuevos = comentarios.map((c, i) =>
      i === index ? { ...c, likes: c.likes + 1 } : c
    );

    setComentarios(nuevos);
    guardarEnLocal(nuevos);
  };

  if (!partido) {
    return <p>Selecciona un partido</p>;
  }

  const homeName = partido.teams
    ? partido.teams.home.name
    : partido.home;

  const awayName = partido.teams
    ? partido.teams.away.name
    : partido.away;

  return (
    <div style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "16px",
      color: "white",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxShadow: "none",
      height: "500px" // 🔑 BLOQUEAMOS LA ALTURA
    }}>

      <style>{`
        .scroll-limpio::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-limpio::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-limpio::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>

      {/* 🟢 MODAL DE USUARIO CON DISEÑO PREMIUM CORREGIDO */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "340px" }}>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: "600", marginBottom: "15px" }}>
              Usuario
            </h2>

            <div className="form">
              <input
                value={nuevoUsuario}
                onChange={(e) => setNuevoUsuario(e.target.value)}
                placeholder="Tu nombre..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") guardarUsuario();
                }}
              />
            </div>

            <div className="modal-actions-grid" style={{ marginTop: "20px" }}>
              <button onClick={guardarUsuario} className="btn-auth active">
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      <h3>⚽ {homeName} vs {awayName}</h3>

      <div className="lista-comentarios" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {comentarios.length === 0 && (
          <p style={{ color: "#aaa" }}>
            No hay comentarios todavía
          </p>
        )}

        {/* 🔑 Contenedor scrolleable */}
        <div className="scroll-limpio" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", paddingRight: "4px", marginBottom: "15px" }}>
          {comentarios.map((c, i) => (
            <div key={i} style={{
              background: "#0f172a",
              padding: "14px 18px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              position: "relative",
              flexShrink: 0
            }}>
              <div>
                <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600" }}>💬 {c.usuario}:</span>
                <span style={{ marginLeft: "6px", color: "#f8fafc", fontSize: "14px" }}>{c.texto}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>
                🤍 {c.likes}
              </div>

              {c.top && (
                <span style={{ position: "absolute", right: "15px", bottom: "14px", color: "#f59e0b", fontSize: "12px", fontWeight: "bold" }}>
                  🔥 TOP
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="input-box" style={{ display: "flex", gap: "10px" }}>
          <input
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            placeholder="Escribe un comentario..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
              outline: "none"
            }}
            onKeyDown={(e) => { if (e.key === "Enter") enviar(); }}
          />
          <button
            onClick={enviar}
            style={{
              background: "#22c55e",
              color: "white",
              padding: "0 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}