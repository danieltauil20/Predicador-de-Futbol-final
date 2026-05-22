from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PARTIDOS = {
    "PD": [ # LIGA ESPAÑOLA
        {
            "id": 1, "temporada": "2025-2026", 
            "homeTeam": {"name": "Real Madrid"}, "awayTeam": {"name": "Barcelona"}, 
            "score": {"fullTime": {"home": 3, "away": 1}},
            "events": [
                {"time": {"elapsed": 12}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "Vinicius Jr"}, "team": {"name": "Real Madrid"}},
                {"time": {"elapsed": 45}, "type": "Card", "detail": "Yellow Card", "player": {"name": "Gavi"}, "team": {"name": "Barcelona"}},
                {"time": {"elapsed": 60}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "J. Bellingham"}, "team": {"name": "Real Madrid"}},
                {"time": {"elapsed": 89}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "K. Mbappé"}, "team": {"name": "Real Madrid"}}
            ]
        },
        {
            "id": 2, "temporada": "2024-2025", 
            "homeTeam": {"name": "Atlético de Madrid"}, "awayTeam": {"name": "Sevilla"}, 
            "score": {"fullTime": {"home": 2, "away": 0}},
            "events": [
                {"time": {"elapsed": 33}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "A. Griezmann"}, "team": {"name": "Atlético de Madrid"}},
                {"time": {"elapsed": 55}, "type": "Card", "detail": "Red Card", "player": {"name": "S. Ramos"}, "team": {"name": "Sevilla"}},
                {"time": {"elapsed": 80}, "type": "Goal", "detail": "Penalty", "player": {"name": "Á. Morata"}, "team": {"name": "Atlético de Madrid"}}
            ]
        }
    ],
    "PL": [ # LIGA INGLESA
        {
            "id": 3, "temporada": "2025-2026", 
            "homeTeam": {"name": "Manchester City"}, "awayTeam": {"name": "Arsenal"}, 
            "score": {"fullTime": {"home": 2, "away": 2}},
            "events": [
                {"time": {"elapsed": 15}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "E. Haaland"}, "team": {"name": "Manchester City"}},
                {"time": {"elapsed": 40}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "B. Saka"}, "team": {"name": "Arsenal"}},
                {"time": {"elapsed": 90}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "K. De Bruyne"}, "team": {"name": "Manchester City"}}
            ]
        },
        {
            "id": 4, "temporada": "2024-2025", 
            "homeTeam": {"name": "Liverpool"}, "awayTeam": {"name": "Chelsea"}, 
            "score": {"fullTime": {"home": 1, "away": 0}},
            "events": [
                {"time": {"elapsed": 20}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "M. Salah"}, "team": {"name": "Liverpool"}},
                {"time": {"elapsed": 75}, "type": "Card", "detail": "Yellow Card", "player": {"name": "E. Fernández"}, "team": {"name": "Chelsea"}}
            ]
        }
    ],
    "SA": [ # LIGA ITALIANA
        {
            "id": 5, "temporada": "2025-2026", 
            "homeTeam": {"name": "Inter Milan"}, "awayTeam": {"name": "Juventus"}, 
            "score": {"fullTime": {"home": 1, "away": 0}},
            "events": [
                {"time": {"elapsed": 30}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "L. Martínez"}, "team": {"name": "Inter Milan"}},
                {"time": {"elapsed": 70}, "type": "Card", "detail": "Yellow Card", "player": {"name": "D. Vlahović"}, "team": {"name": "Juventus"}}
            ]
        }
    ],
    "BL": [ # LIGA ALEMANA
        {
            "id": 7, "temporada": "2025-2026", 
            "homeTeam": {"name": "Bayern Munich"}, "awayTeam": {"name": "B. Dortmund"}, 
            "score": {"fullTime": {"home": 2, "away": 1}},
            "events": [
                {"time": {"elapsed": 10}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "H. Kane"}, "team": {"name": "Bayern Munich"}},
                {"time": {"elapsed": 50}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "J. Brandt"}, "team": {"name": "B. Dortmund"}},
                {"time": {"elapsed": 85}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "J. Musiala"}, "team": {"name": "Bayern Munich"}}
            ]
        }
    ],
    "WC": [ # MUNDIAL 2026
        {
            "id": 9, "temporada": "Mundial 2026", 
            "homeTeam": {"name": "España"}, "awayTeam": {"name": "Argentina"}, 
            "score": {"fullTime": {"home": 2, "away": 2}},
            "events": [
                {"time": {"elapsed": 25}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "L. Yamal"}, "team": {"name": "España"}},
                {"time": {"elapsed": 45}, "type": "Goal", "detail": "Penalty", "player": {"name": "L. Messi"}, "team": {"name": "Argentina"}},
                {"time": {"elapsed": 60}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "J. Álvarez"}, "team": {"name": "Argentina"}},
                {"time": {"elapsed": 88}, "type": "Goal", "detail": "Normal Goal", "player": {"name": "Pedri"}, "team": {"name": "España"}}
            ]
        }
    ]
}

@app.route('/api/fixtures/historico', methods=['GET'])
def get_historico():
    liga = request.args.get('liga', 'PD')
    partidos = DB_PARTIDOS.get(liga, [])
    return jsonify(partidos)

if __name__ == '__main__':
    app.run(port=3001, debug=True)