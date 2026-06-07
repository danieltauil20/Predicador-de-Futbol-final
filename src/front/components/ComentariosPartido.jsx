import { useState } from "react";

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

      <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        ⚽ {partido.home} vs {partido.away}
      </h2>

      {/* 🔑 Este contenedor asume el espacio central y scrollea de forma independiente */}
      <div className="scroll-limpio" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", paddingRight: "4px" }}>
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

      <div style={{ display: "flex", gap: "10px" }}>
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
  );
}