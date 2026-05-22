export const PartidoCard = ({
  liga,
  local,
  visitante,
  resultado,
  fecha,
  estado,
}) => {
  const getColor = () => {
    switch (estado?.toLowerCase()) {
      case "finalizado":
        return "#666";

      case "en vivo":
        return "red";

      case "proximo":
        return "green";

      default:
        return "white";
    }
  };

  const getStatusIcon = () => {
    switch (estado?.toLowerCase()) {
      case "finalizado":
        return "⚫";

      case "en vivo":
        return "🔴";

      case "proximo":
        return "🟢";

      default:
        return "⚪";
    }
  };

  return (
    <div
      style={{
        background: "#1e1e1e",
        margin: "10px auto",
        padding: "15px",
        borderRadius: "12px",
        width: "320px",
        borderLeft: `5px solid ${getColor()}`,
        color: "white",
      }}
    >
      <small>{liga}</small>

      <h3>
        {local} vs {visitante}
      </h3>

      <div>{resultado || "VS"}</div>

      <small>
        {new Date(fecha).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </small>

      <div style={{ color: getColor(), fontWeight: "bold" }}>
        {getStatusIcon()} {estado}
      </div>
    </div>
  );
};