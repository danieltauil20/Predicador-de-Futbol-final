import React, { useState } from 'react';

export const RulesCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="gt-rules-container">
      <div className="gt-rules-header" onClick={() => setIsOpen(!isOpen)}>
        <span>📜 Normativas y Reglas del Juego</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="gt-rules-content">
          <p>¡Bienvenido a la Quiniela! Por registrarte, ya hemos sumado <strong>30 puntos base</strong> a tu cuenta para que comiences a competir. Gana más puntos así:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li style={{ marginBottom: '8px' }}><span style={{ color: 'var(--neon-gold)', fontWeight: 'bold' }}>🥇 3 Puntos:</span> Acierto de marcador exacto (Ej: Predices 2-1 y termina 2-1).</li>
            <li style={{ marginBottom: '8px' }}><span style={{ color: '#C0C0C0', fontWeight: 'bold' }}>🥈 1 Punto:</span> Aciertas qué equipo gana o si hay empate, pero fallas los goles (Ej: Predices 3-0 y termina 1-0).</li>
            <li><span style={{ color: '#ff4a5a', fontWeight: 'bold' }}>💔 0 Puntos:</span> Fallo total en el resultado.</li>
          </ul>
        </div>
      )}
    </div>
  );
};