const fs = require('fs');

// Ruta del archivo
const filePath = './src/front/components/partidos.json';

// Leemos el archivo
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Lógica de actualización
let round = 1;
const updatedData = data.map((partido, index) => {
    // Definimos los nuevos valores
    const newSeason = "2024-2025";
    
    // Si ya tiene Round y Season, lo dejamos igual para no sobrescribir
    if (partido.Round && partido.Season) return partido;
    
    // Cálculo de jornada (cada 9 partidos sumamos 1)
    if (index > 0 && index % 9 === 0) round++;
    
    return { 
        ...partido, 
        Season: newSeason, 
        Round: round 
    };
});

// Guardamos el archivo actualizado
fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
console.log("¡Archivo actualizado con campos Season y Round exitosamente!");