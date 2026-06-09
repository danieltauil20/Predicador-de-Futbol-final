import sys
import os
# Ajuste para encontrar app.py dentro de 'src'
sys.path.append(os.path.join(os.getcwd(), 'src'))

from app import app, db, Partido, Evento

def cargar_datos_prueba():
    with app.app_context():
        # Datos de la temporada 2024-2025
        nuevos_partidos = [
            {
                "liga": "PD",
                "temporada": "2024-2025",
                "jornada": 1,
                "home_team": "Real Madrid",
                "away_team": "Barcelona",
                "score_home": 2,
                "score_away": 1,
                "eventos": [
                    {"tipo": "gol", "jugador": "Vinicius Jr", "minuto": 45},
                    {"tipo": "tarjeta_amarilla", "jugador": "Gavi", "minuto": 60}
                ]
            }
        ]

        for p in nuevos_partidos:
            nuevo_partido = Partido(
                liga=p['liga'],
                temporada=p['temporada'],
                jornada=p['jornada'],
                home_team=p['home_team'],
                away_team=p['away_team'],
                score_home=p['score_home'],
                score_away=p['score_away']
            )
            db.session.add(nuevo_partido)
            db.session.commit()

            for e in p['eventos']:
                evento = Evento(
                    tipo=e['tipo'],
                    jugador=e['jugador'],
                    minuto=e['minuto'],
                    partido_id=nuevo_partido.id
                )
                db.session.add(evento)
            
            db.session.commit()
            print(f"Partido cargado: {p['home_team']} vs {p['away_team']}")

if __name__ == '__main__':
    cargar_datos_prueba()
