const fs = require('fs');
const filePath = './src/front/components/partidos.json';

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Ordenar: Primero por Season, luego por Round
const dataOrdenada = data.sort((a, b) => {
    if (a.Season !== b.Season) return a.Season.localeCompare(b.Season);
    return parseInt(a.Round) - parseInt(b.Round);
});

fs.writeFileSync(filePath, JSON.stringify(dataOrdenada, null, 2));
console.log("¡Archivo organizado por Temporada y Jornada!");