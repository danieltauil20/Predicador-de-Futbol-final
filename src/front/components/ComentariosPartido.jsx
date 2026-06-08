import { useState, useEffect } from "react";
import { FaHeart, FaFire, FaComment } from "react-icons/fa";

export default function ComentariosPartido({ partido }) {
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto] = useState("");

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
    if (!texto.trim()) return;

    const nuevos = [
      ...comentarios,
      {
        texto,
        likes: 0,
        usuario: usuario
      }
    ];

    setComentarios(nuevos);
    guardarEnLocal(nuevos);
    setTexto("");
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
    <div className="comentarios-container">

      
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Usuario</h3>

            <input
              value={nuevoUsuario}
              onChange={(e) => setNuevoUsuario(e.target.value)}
              placeholder="Tu nombre..."
              onKeyDown={(e) => {
                if (e.key === "Enter") guardarUsuario();
              }}
            />

            <button onClick={guardarUsuario}>
              Entrar
            </button>
          </div>
        </div>
      )}

      <h3>⚽ {homeName} vs {awayName}</h3>

      <div className="lista-comentarios">
        {comentarios.length === 0 && (
          <p style={{ color: "#aaa" }}>
            No hay comentarios todavía
          </p>
        )}

        {comentarios.map((c, i) => (
          <div key={i} className="comentario-card">

            <div className="texto">
              <FaComment /> <strong>{c.usuario || "Rigo"}</strong>: {c.texto}
            </div>

            <div className="acciones">
              <span onClick={() => darLike(i)}>
                <FaHeart /> {c.likes}
              </span>

              {c.likes >= 3 && (
                <span className="top-badge">
                  <FaFire /> TOP
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un comentario..."
        />

        <button onClick={agregar}>
          Enviar
        </button>
      </div>

    </div>
  );
}