import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db_path = os.path.join(os.getcwd(), 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Partido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    liga = db.Column(db.String(10))
    temporada = db.Column(db.String(20))
    jornada = db.Column(db.Integer)
    home_team = db.Column(db.String(100))
    away_team = db.Column(db.String(100))
    score_home = db.Column(db.Integer)
    score_away = db.Column(db.Integer)

with app.app_context():
    db.create_all()
    print(f"DEBUG: Tablas creadas en {db_path}")
    
    nuevo = Partido(liga='PD', temporada='2024-2025', jornada=1, home_team='Real Madrid', away_team='Barcelona', score_home=2, score_away=1)
    db.session.add(nuevo)
    db.session.commit()
    print("¡ÉXITO! Se crearon las tablas e insertaron datos correctamente.")
