import React from "react";

export default function Normas() {
  return (
    <div style={{ 
      background: "#1e293b", 
      padding: "20px", 
      borderRadius: "12px", 
      boxShadow: "none", 
      border: "1px solid #334155",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <h3 style={{ 
        color: "#ffffff", 
        fontSize: "1.1rem", 
        fontWeight: "700", 
        marginBottom: "20px",
        textAlign: "center"
      }}>
        📋 ESTRATEGIA: NORMAS
      </h3>
      
      <ul style={{ 
        listStyleType: "none", 
        padding: 0, 
        margin: 0, 
        display: "flex", 
        flexDirection: "column", 
        gap: "14px"
      }}>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
          <span>🔹</span> <span style={{ color: "#cbd5e1" }}>Respeta a todos en la grada.</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
          <span>🔹</span> <span style={{ color: "#cbd5e1" }}>Cero insultos o faltas.</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
          <span>🔹</span> <span style={{ color: "#cbd5e1" }}>No envíes mensajes basura (spam).</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
          <span>🔹</span> <span style={{ color: "#cbd5e1" }}>Centrarse exclusivamente en fútbol.</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171", fontWeight: "600", fontSize: "14px" }}>
          <span>⭕</span> <span style={{ color: "#f87171" }}>Expulsión inmediata ante faltas.</span>
        </li>
      </ul>
    </div>
  );
}