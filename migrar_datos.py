import sys
import os
import json

# Ajuste de ruta para encontrar app.py en src
sys.path.append(os.path.join(os.getcwd(), 'src'))

from app import app, db, Partido, Evento

def migrar():
    with app.app_context():
        # Crear las tablas
        db.create_all()
        print("Tablas creadas. Iniciando migración...")
        
        ruta_json = os.path.join('src', 'data.json')
        
        if not os.path.exists(ruta_json):
            print(f"ERROR: No encuentro el archivo en {ruta_json}")
            return

        with open(ruta_json, 'r', encoding='utf-8') as f:
            datos = json.load(f)
            
            for d in datos:
                nuevo_partido = Partido(
                    liga=d.get('liga'),
                    temporada=d.get('temporada'),
                    jornada=d.get('jornada'),
                    home_team=d.get('homeTeam', {}).get('name'),
                    away_team=d.get('awayTeam', {}).get('name'),
                    score_home=d.get('score', {}).get('fullTime', {}).get('home', 0),
                    score_away=d.get('score', {}).get('fullTime', {}).get('away', 0)
                )
                db.session.add(nuevo_partido)
                db.session.commit()
                
                for e in d.get('eventos', []):
                    nuevo_evento = Evento(tipo=e.get('tipo'), jugador=e.get('jugador'), minuto=e.get('minuto'), partido_id=nuevo_partido.id)
                    db.session.add(nuevo_evento)
                db.session.commit()
        print("¡Migración completada con éxito!")

if __name__ == '__main__':
    migrar()
