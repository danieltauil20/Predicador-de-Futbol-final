import pandas as pd
from src.app import db, app, Partido

def importar_csv(archivo_csv, liga_nombre, temporada_nombre):
    """
    Importa partidos desde un CSV a la base de datos.
    """
    try:
        df = pd.read_csv(archivo_csv)
        with app.app_context():
            # Creamos las tablas si no existen al iniciar la importación
            db.create_all()
            
            for _, row in df.iterrows():
                # Creamos el objeto Partido
                # Nota: 'Jornada' se busca en el CSV, si no existe, asignamos 0 por defecto
                nuevo_partido = Partido(
                    liga=liga_nombre,
                    temporada=temporada_nombre,
                    jornada=int(row.get('Jornada', 0)),
                    home_team=row['HomeTeam'],
                    away_team=row['AwayTeam'],
                    score_home=int(row['FTHG']),
                    score_away=int(row['FTAG']),
                    fecha=str(row['Date']),
                    hora=str(row.get('Time', 'N/A')),
                    estadio="N/A"
                )
                db.session.add(nuevo_partido)
            
            db.session.commit()
            print(f"✅ Éxito: Importados {len(df)} partidos de {liga_nombre} ({temporada_nombre}).")
            
    except Exception as e:
        print(f"❌ Error al procesar {archivo_csv}: {e}")

if __name__ == "__main__":
    # LISTA DE CARGA MASIVA
    # Asegúrate de que los archivos existan en la carpeta 'data'
    tareas = [
        ("data/ESPAÑA-2024-2025.csv", "La Liga", "2024-2025"),
        ("data/ESPAÑA-2025-2026.csv", "La Liga", "2025-2026"),
        ("data/INGLATERRA-2024-2025.csv", "Premier League", "2024-2025"),
        ("data/INGLATERRA-2025-2026.csv", "Premier League", "2025-2026"),
        ("data/ALEMANIA-2024-2025.csv", "Bundesliga", "2024-2025"),
        ("data/ALEMANIA-2025-2026.csv", "Bundesliga", "2025-2026"),
        ("data/ITALIA-2024-2025.csv", "Serie A", "2024-2025"),
        ("data/ITALIA-2025-2026.csv", "Serie A", "2025-2026")
    ]
    
    for archivo, liga, temp in tareas:
        importar_csv(archivo, liga, temp)