export default function HeaderLiga({ ligaNombre }) {
  // Limpiamos el nombre para el título
  const nombreLimpio = ligaNombre.replace("-", " ").toUpperCase();
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: "40px 0 30px 0",
      textAlign: "center",
      color: "white"
    }}>
      <h1 style={{ margin: "0 0 15px 0", fontSize: "2.5rem", letterSpacing: "2px", fontWeight: "900" }}>
        {nombreLimpio}
      </h1>
      <div style={{ 
        display: "flex", 
        gap: "15px", 
        background: "#1e293b", 
        padding: "8px 20px", 
        borderRadius: "25px",
        fontSize: "0.9rem",
        color: "#94a3b8"
      }}>
        <span>Temporada 2025/2026</span>
        <span>|</span>
        <span>Jornada 12</span>
      </div>
    </div>
  );
}