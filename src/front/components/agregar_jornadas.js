const fs = require('fs');

// Leer el JSON
const partidos = JSON.parse(fs.readFileSync('partidos.json', 'utf8'));

// Asignar jornadas: cada 9 partidos subimos de jornada
let jornadaActual = 1;
const partidosConJornada = partidos.map((p, index) => {
    if (index > 0 && index % 9 === 0) {
        jornadaActual++;
    }
    return { ...p, Round: jornadaActual };
});

// Guardar el nuevo JSON
fs.writeFileSync('partidos.json', JSON.stringify(partidosConJornada, null, 2));
console.log("¡Jornadas añadidas correctamente!");