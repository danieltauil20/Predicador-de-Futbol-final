const fs = require('fs');
const path = './src/front/components/partidos.json';

try {
    const rawData = fs.readFileSync(path, 'utf8');
    const data = JSON.parse(rawData);
    console.log("Archivo JSON leído correctamente. Tiene " + data.length + " partidos.");
    
    // Aquí puedes continuar con la lógica de división si quieres
} catch (e) {
    console.error("Error al leer el archivo:");
    console.error(e.message);
}
