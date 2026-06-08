import React from 'react';
import '../TeamForm.css';

export const TeamForm = ({ formString }) => {
  // 1. Si la API no nos manda la racha (string vacío), imprimimos un texto de fallback
  if (!formString) return <div className="gt-form-fallback">N/A</div>;

  // 2. Se convirtió el texto "WWDLW" en un arreglo de letras y agarramos solo las últimas 5
  const lastFive = formString.split('').slice(-5);

  return (
    <div className="gt-form-container">
      {lastFive.map((result, index) => {
        
        let statusClass = 'gt-form-d'; // Gris por defecto (Draw / Empate)
        if (result === 'W') statusClass = 'gt-form-w'; // Verde (Win / Victoria)
        if (result === 'L') statusClass = 'gt-form-l'; // Rojo (Loss / Derrota)

        return (
          <span key={index} className={`gt-form-dot ${statusClass}`} title={`Resultado: ${result}`}>
            {result}
          </span>
        );
      })}
    </div>
  );
};