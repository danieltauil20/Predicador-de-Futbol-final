import { useState, useEffect } from "react";
import PartidosTop from "../components/PartidosTop";
import ComentariosPartido from "../components/ComentariosPartido";
import ForoMini from "../components/ForoMini";

export const Comentarios = () => {
  const [partido, setPartido] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta si la pantalla es de un dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ maxWidth: "1175px", margin: "40px auto", padding: "0 20px", boxSizing: "border-box" }}>
      
      <h1 style={{ 
        color: "white", 
        fontSize: isMobile ? "1.4rem" : "1.8rem", 
        fontWeight: "700", 
        marginBottom: "24px",
        textAlign: isMobile ? "center" : "left"
      }}>
        🔥 Partidos TOP
      </h1>

      {/* 🔴 CONTENEDOR GRID RESPONSIVO */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", /* 1 columna en móvil, 2 en PC */
        gap: "30px", 
        width: "100%",
        alignItems: "start",
        boxSizing: "border-box"
      }}>
        
        {/* ==========================================
            COLUMNA IZQUIERDA (Partidos y Foro)
           ========================================== */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", minWidth: "0" }}>
          <PartidosTop setPartido={setPartido} />
          <ForoMini />
        </div>

        {/* ==========================================
            COLUMNA DERECHA (Normas y Comentarios)
           ========================================== */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", minWidth: "0" }}>
          
          {/* 📜 RECUADRO DE NORMAS (Siempre arriba a la derecha en PC) */}
          <div className="normas-box-fija" style={{
            background: "#1e293b", 
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <h2 style={{ color: "white", fontSize: "1.3rem", fontWeight: "700", margin: "0 0 15px 0" }}>
              📜 Normas
            </h2>
            <ul style={{ color: "#bfc3ca", fontSize: "0.9rem", lineHeight: "1.8", paddingLeft: "20px", margin: 0 }}>
              <li>Respeta a todos</li>
              <li>No insultos</li>
              <li>No mensajes basura</li>
              <li>Solo fútbol ⚽</li>
              <li style={{ lineHeight: "1.4", marginTop: "6px" }}>
                Si el usuario no respeta las normas será expulsado
              </li>
            </ul>
          </div>

          {/* Caja de Comentarios (Encajada perfectamente abajo) */}
          <ComentariosPartido partido={partido} />

        </div>

      </div>

    </div>
  );
};

export default Comentarios;
