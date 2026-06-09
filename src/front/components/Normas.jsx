export default function Normas() {
  return (
    <div style={{
      background: "#E2E8F0",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #334155",
      width: "25%", /* <-- Reducimos el ancho para que quepa en la fila */
      boxSizing: "border-box",
      marginLeft: "1100px",
      marginTop: "-300px",
      
    }}>

      <h3 style={{
        color: "#1E293B", // Un color que destaque y pegue con tu diseño
        fontSize: "1.1rem",
        fontWeight: "700",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        📜 NORMAS
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
          <span>⚽</span> <span style={{ color: "#166AEF" }}>Respeta a todos en la grada.</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
          <span>⚽</span> <span style={{ color: "#166AEF" }}>Cero insultos o faltas.</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
          <span>⚽</span> <span style={{ color: "#166AEF" }}>No envíes mensajes basura (spam).</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
          <span>⚽</span> <span style={{ color: "#166AEF" }}>Centrarse exclusivamente en fútbol.</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "red", fontWeight: "600", fontSize: "14px" }}>
          <span>🟥</span> <span style={{ color: "red" }}>Expulsión inmediata ante faltas.</span>
        </li>
      </ul>
    </div>
  );
}