import React from "react";

export default function Normas() {
  return (
    <div className="normas-box-derecha" style={{
      background: "#1e293b", /* Fondo oscuro idéntico al foro para que haga juego */
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
      width: "100%"
    }}>
      <h2 style={{ 
        color: "white", 
        fontSize: "1.3rem", 
        fontWeight: "700", 
        margin: "0 0 15px 0"
      }}>
        📜 Normas
      </h2>
      
      <ul style={{ 
        color: "#bfc3ca", 
        fontSize: "0.9rem", 
        lineHeight: "1.8", 
        paddingLeft: "20px",
        margin: 0 
      }}>
        <li>Respeta a todos</li>
        <li>No insultos</li>
        <li>No mensajes basura</li>
        <li>Solo fútbol ⚽</li>
        <li style={{ lineHeight: "1.4", marginTop: "6px" }}>
          Si el usuario no respeta las normas será expulsado  
        </li>
      </ul>
    </div>
  );
}
