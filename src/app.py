from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_TOKEN = "7fc4c822095b45d590fa0cd500eb3d5f"
HEADERS = {"X-Auth-Token": API_TOKEN}
MAPEO_LIGAS = {"PD": "PD", "PL": "PL", "SA": "SA", "BL": "BL1", "WC": "WC"}

@app.route('/api/fixtures/historico', methods=['GET'])
def get_historico():
    liga = request.args.get('liga', 'PD')
    temporada = request.args.get('temporada', '2025')
    
    # Si es Mundial, devolvemos datos vacíos o tu JSON local
    if liga == "WC":
        return jsonify([]), 200
        
    id_liga = MAPEO_LIGAS.get(liga, "PD")
    url = f"https://api.football-data.org/v4/competitions/{id_liga}/matches?season={temporada}"
    
    res = requests.get(url, headers=HEADERS)
    return jsonify(res.json().get("matches", [])), 200

@app.route('/api/partido/detalle/<partido_id>', methods=['GET'])
def get_detalle_partido(partido_id):
    # Simulamos datos para el detalle
    return jsonify({
        "goles": [{"jugador": "Jugador 1"}, {"jugador": "Jugador 2"}],
        "tarjetas": [{"jugador": "Jugador 3"}]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)