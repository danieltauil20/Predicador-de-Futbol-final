import { useState } from "react";

export const ComentariosPartido = ({ partido }) => {
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [listaComentarios, setListaComentarios] = useState([
    { id: 1, usuario: "Rigo", texto: "¡Qué partidazo se viene!", partidoId: 2 },
    { id: 2, usuario: "Admin", texto: "Recuerden respetar las normas", partidoId: 2 }
  ]);

  const enviarComentario = (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    const comentarioObj = {
      id: Date.now(),
      usuario: "Tú",
      texto: nuevoComentario,
      partidoId: partido?.id || partido || 2
    };

    setListaComentarios([...listaComentarios, comentarioObj]);
    setNuevoComentario("");
  };

  const idPartidoActual = partido?.id || partido || 2;
  const comentariosFiltrados = listaComentarios.filter(c => c.partidoId === idPartidoActual);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>
      
      {/* 📜 1. BLOQUE DE NORMAS (Forzado dentro del archivo singular) */}
      <div className="normas-box-fija" style={styles.normasBox}>
        <h2 style={styles.normasTitle}>📜 Normas</h2>
        <ul style={styles.normasList}>
          <li>Respeta a todos</li>
          <li>No insultos</li>
          <li>No mensajes basura</li>
          <li>Solo fútbol ⚽</li>
          <li style={styles.normasAlert}>
            Si el usuario no respeta las normas será expulsado
          </li>
        </ul>
      </div>

      {/* 💬 2. CAJA DE COMENTARIOS */}
      <div style={styles.comentariosBox}>
        <h3 style={styles.comentariosTitle}>💬 Comentarios de la Comunidad</h3>
        <p style={styles.partidoTexto}>
          Visualizando el partido: <strong>{partido?.nombre || `Partido #${idPartidoActual}`}</strong>
        </p>

        <div style={styles.listaComentarios}>
          {comentariosFiltrados.length > 0 ? (
            comentariosFiltrados.map((c) => (
              <div key={c.id} style={styles.comentarioItem}>
                <span style={styles.usuarioTexto}>{c.usuario}:</span>
                <span style={styles.mensajeTexto}> {c.texto}</span>
              </div>
            ))
          ) : (
            <p style={styles.noComentariosText}>Aún no hay comentarios. ¡Sé el primero!</p>
          )}
        </div>

        <form onSubmit={enviarComentario} style={styles.formulario}>
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.boton}>Enviar</button>
        </form>
      </div>

    </div>
  );
};

// 🚨 EXPORTACIÓN EN SINGULAR PARA TRUCAR EL ARCHIVO VIEJO QUE RECLAMA VITE
export default ComentariosPartido;

const styles = {
  normasBox: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
    width: "100%",
    boxSizing: "border-box"
  },
  normasTitle: {
    color: "white",
    fontSize: "1.3rem",
    fontWeight: "700",
    margin: "0 0 15px 0",
  },
  normasList: {
    color: "#bfc3ca",
    fontSize: "0.9rem",
    lineHeight: "1.8",
    paddingLeft: "20px",
    margin: 0,
  },
  normasAlert: {
    lineHeight: "1.4",
    marginTop: "6px",
  },
  comentariosBox: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    maxHeight: "400px",
  },
  comentariosTitle: {
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "700",
    margin: "0 0 5px 0",
  },
  partidoTexto: {
    color: "#60a5fa",
    fontSize: "0.85rem",
    marginBottom: "15px",
  },
  listaComentarios: {
    background: "#0f172a",
    borderRadius: "12px",
    padding: "15px",
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "15px",
  },
  comentarioItem: {
    fontSize: "0.9rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
    paddingBottom: "6px",
  },
  usuarioTexto: {
    color: "#4ade80",
    fontWeight: "700",
  },
  mensajeTexto: {
    color: "#e2e8f0",
  },
  noComentariosText: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    textAlign: "center",
    paddingTop: "20px",
  },
  formulario: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },
  input: {
    flex: 1,
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "white",
    fontSize: "0.9rem",
    outline: "none",
  },
  boton: {
    background: "#4ade80",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    padding: "0 16px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.9rem",
  }
};
