const fs = require('fs');

const inputFile = './src/front/components/partidos.json';
const outputDir = './src/front/components/data_limpia';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const rawData = fs.readFileSync(inputFile, 'utf8');
const data = JSON.parse(rawData);

// Agrupamos los datos por Div y Season
const grupos = {};

data.forEach(p => {
    // Si no tienen Season o Round, les ponemos un valor por defecto para evitar errores
    const key = `${p.Div}_${p.Season || 'sin_temporada'}`;
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(p);
});

// Guardamos cada grupo en un archivo separado
Object.keys(grupos).forEach(key => {
    fs.writeFileSync(`${outputDir}/${key}.json`, JSON.stringify(grupos[key], null, 2));
    console.log(`Archivo creado: ${key}.json`);
});