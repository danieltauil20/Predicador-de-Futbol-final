import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# 1. Creamos una app temporal para configurar la DB exactamente aquí
app = Flask(__name__)
# Ruta absoluta a la raíz
db_path = os.path.join(os.getcwd(), 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 2. Copiamos tus modelos aquí para que la tabla exista en esta instancia
class Partido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    liga = db.Column(db.String(10))
    temporada = db.Column(db.String(20))
    jornada = db.Column(db.Integer)
    home_team = db.Column(db.String(100))
    away_team = db.Column(db.String(100))
    score_home = db.Column(db.Integer)
    score_away = db.Column(db.Integer)

class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20))
    jugador = db.Column(db.String(100))
    minuto = db.Column(db.String(10))
    partido_id = db.Column(db.Integer, db.ForeignKey('partido.id'))

# 3. Ejecución directa
with app.app_context():
    db.create_all()
    print(f"DEBUG: Tablas creadas en {db_path}")
    
    # Probamos una inserción simple
    nuevo = Partido(liga='PD', temporada='2024-2025', jornada=1, home_team='Real Madrid', away_team='Barcelona', score_home=2, score_away=1)
    db.session.add(nuevo)
    db.session.commit()
    print("¡ÉXITO! Se crearon las tablas e insertaron datos correctamente.")