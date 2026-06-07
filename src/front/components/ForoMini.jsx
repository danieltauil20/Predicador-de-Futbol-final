import { useState } from "react";

export default function ForoMini() {
  const [temas, setTemas] = useState([
    { creador: "Jose", titulo: "holaaaa" },
    { creador: "Luis", titulo: "holaaaa" },
    { creador: "bea", titulo: "hola" },
    { creador: "bea", titulo: "holaaaa" }
  ]);
  const [nuevoTema, setNuevoTema] = useState("");
  
  const usuarioActivo = "Jose"; 

  const agregarTema = () => {
    if (!nuevoTema.trim()) return;
    setTemas([...temas, { titulo: nuevoTema, creador: usuarioActivo }]);
    setNuevoTema("");
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
      {/* Estilo para una barra de scroll moderna y oscura */}
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

      <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
        💬 Foro
      </h3>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={nuevoTema}
          onChange={(e) => setNuevoTema(e.target.value)}
          placeholder="Crear tema..."
          style={{ 
            flex: 1, 
            padding: "10px 14px", 
            borderRadius: "8px", 
            border: "1px solid #334155", 
            background: "#0f172a", 
            color: "white", 
            outline: "none"
          }}
          onKeyDown={(e) => { if (e.key === "Enter") agregarTema(); }}
        />
        <button 
          onClick={agregarTema} 
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

      {/* 🔑 Este contenedor ahora asume el espacio restante y scrollea */}
      <div className="scroll-limpio" style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", flex: 1, paddingRight: "4px" }}>
        {temas.map((t, i) => (
          <div key={i} style={{ 
            background: "#0f172a", 
            padding: "12px 16px", 
            borderRadius: "10px",
            border: "none",
            flexShrink: 0 // Evita que los mensajes se aplasten
          }}>
            <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600" }}>{t.creador}:</span> 
            <span style={{ marginLeft: "6px", color: "#f8fafc", fontSize: "14px" }}>{t.titulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}