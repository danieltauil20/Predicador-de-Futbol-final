const fs = require('fs');
const path = './src/front/components/partidos.json';

try {
    const data = fs.readFileSync(path, 'utf8');
    JSON.parse(data);
    console.log("¡El JSON es válido!");
} catch (e) {
    console.error("Error encontrado en:", e.message);
    // Esto te dirá exactamente en qué posición está el fallo
}