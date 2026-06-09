{/* MODAL CON ESTILO PREMIUM */}
{partidoSeleccionado && (
  <div style={styles.modalOverlay} onClick={() => setPartidoSeleccionado(null)}>
    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
      <button style={styles.closeButton} onClick={() => setPartidoSeleccionado(null)}>✕</button>
      
      {/* Cabecera con más impacto */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div style={{ fontSize: "0.8rem", color: "#0EE7AC", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>Análisis Post-Partido</div>
        <h2 style={{ color: "#FFF", fontSize: "1.8rem", margin: "0" }}>
          {partidoSeleccionado.home} <span style={{color: "#94A3B8", fontSize: "1.2rem"}}>vs</span> {partidoSeleccionado.away}
        </h2>
        <div style={{ marginTop: "10px", fontSize: "2rem", fontWeight: "800", color: "#FFF" }}>
          {partidoSeleccionado.scoreHome} - {partidoSeleccionado.scoreAway}
        </div>
      </div>

      {/* Grid de Stats con más estilo */}
      <div style={{ backgroundColor: "#0F172A", padding: "20px", borderRadius: "16px" }}>
        <StatBar label="Tiros Totales" l={partidoSeleccionado.HS} a={partidoSeleccionado.AS} />
        <StatBar label="Tiros a Puerta" l={partidoSeleccionado.HST} a={partidoSeleccionado.AST} />
        <StatBar label="Córners" l={partidoSeleccionado.HC} a={partidoSeleccionado.AC} />
        <StatBar label="Faltas" l={partidoSeleccionado.HF} a={partidoSeleccionado.AF} />
      </div>
      
      <div style={{ marginTop: "20px", textAlign: "center", color: "#64748B", fontSize: "0.85rem" }}>
        Haz clic fuera para cerrar
      </div>
    </div>
  </div>
)}