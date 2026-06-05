import { useState, useEffect } from "react";
import "../body.css";

export default function ForoMini() {
  const [temas, setTemas] = useState([]);
  const [nuevo, setNuevo] = useState("");

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("foro")) || [
      { texto: "¿Quién ganará la Champions?", usuario: "Rigo" }
    ];
    setTemas(guardados);
  }, []);

  const agregar = () => {
    if (!nuevo.trim()) return;
    const nuevosTemas = [{ texto: nuevo, usuario: "Rigo" }, ...temas];
    setTemas(nuevosTemas);
    localStorage.setItem("foro", JSON.stringify(nuevosTemas));
    setNuevo("");
  };

  return (
    <div className="foro-container" style={{
      background: "#1e293b",
      borderRadius: "12px",
      padding: "20px",
      height: "280px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
    }}>
      <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#ffffff", fontWeight: "700" }}>💬 Foro</h2>

      {/* INPUT */}
      <div className="input-box" style={{ display: "flex", gap: "10px" }}>
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Crear tema..."
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
            outline: "none"
          }}
        />
        <button onClick={agregar} style={{
          background: "#0ee7ac",
          color: "#0f172a",
          border: "none",
          padding: "0 14px",
          borderRadius: "6px",
          fontWeight: "600",
          cursor: "pointer"
        }}>
          Crear
        </button>
      </div>

      {/* LISTA */}
      <div className="lista-temas" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
        {temas.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: "0.9rem" }}>No hay temas todavía</p>
        ) : (
          temas.map((tema, i) => (
            <div key={i} className="tema-card" style={{ background: "#0f172a", padding: "10px", borderRadius: "6px", fontSize: "0.9rem" }}>
              <span>
                <strong style={{ color: "#0ee7ac" }}>{tema.usuario || "Rigo"}</strong>: {tema.texto}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
