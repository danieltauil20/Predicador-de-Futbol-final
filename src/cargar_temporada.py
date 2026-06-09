import os
import sys

# Asegurar que puede importar desde la carpeta src
sys.path.append(os.path.join(os.getcwd(), 'src'))

from app import app, db, Partido, Evento

def cargar_datos():
    with app.app_context():
        # Crear las tablas explícitamente en la misma ruta que usa el servidor
        db.create_all()
        print(f"Base de datos preparada en: {app.config['SQLALCHEMY_DATABASE_URI']}")

        # Insertar datos de prueba
        nuevo_partido = Partido(
            liga="PD",
            temporada="2024-2025",
            jornada=1,
            home_team="Real Madrid",
            away_team="Barcelona",
            score_home=2,
            score_away=1
        )
        db.session.add(nuevo_partido)
        db.session.commit()

        evento = Evento(tipo="gol", jugador="Vinicius Jr", minuto="45", partido_id=nuevo_partido.id)
        db.session.add(evento)
        db.session.commit()
        
        print("¡ÉXITO! Los datos se han guardado correctamente.")

if __name__ == '__main__':
    cargar_datos()