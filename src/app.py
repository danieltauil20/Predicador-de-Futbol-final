import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Ruta absoluta forzada a la raíz
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "database.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelos


class Partido(db.Model):
    __tablename__ = 'partido'
    id = db.Column(db.Integer, primary_key=True)
    liga = db.Column(db.String(10))
    temporada = db.Column(db.String(20))
    jornada = db.Column(db.Integer)
    home_team = db.Column(db.String(100))
    away_team = db.Column(db.String(100))
    score_home = db.Column(db.Integer)
    score_away = db.Column(db.Integer)
    fecha = db.Column(db.String(20))
    hora = db.Column(db.String(10))
    estadio = db.Column(db.String(100))
    eventos = db.relationship('Evento', backref='partido', lazy=True)


class Evento(db.Model):
    __tablename__ = 'evento'
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20))
    jugador = db.Column(db.String(100))
    minuto = db.Column(db.String(10))
    partido_id = db.Column(db.Integer, db.ForeignKey(
        'partido.id'), nullable=False)


@app.route('/api/fixtures/historico', methods=['GET'])
def get_historico():
    liga = request.args.get('liga', 'La Liga')
    temporada = request.args.get('temporada', '2024-2025')

    print(f"Buscando en BD: liga={liga}, temporada={temporada}")

    partidos = Partido.query.filter_by(liga=liga, temporada=temporada).all()

    print(f"Resultados encontrados: {len(partidos)}")

    resultado = [{
        "id": p.id,
        "jornada": p.jornada,
        "homeTeam": {"name": p.home_team},
        "awayTeam": {"name": p.away_team},
        "score": {"fullTime": {"home": p.score_home, "away": p.score_away}},
        "eventos": [{"tipo": e.tipo, "jugador": e.jugador, "minuto": e.minuto} for e in p.eventos]
    } for p in partidos]

    return jsonify(resultado)


if __name__ == '__main__':
    app.run(port=3001, debug=True)
