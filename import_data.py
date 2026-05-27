import pandas as pd
from src.app import db, app, Partido


def importar_csv(archivo_csv, liga_nombre):
    # Cargamos el CSV
    df = pd.read_csv(archivo_csv)

    with app.app_context():
        db.create_all()  # Esto crea las tablas si no existen

        for _, row in df.iterrows():
            nuevo_partido = Partido(
                liga=liga_nombre,
                temporada="2024-2025",
                home_team=row['HomeTeam'],
                away_team=row['AwayTeam'],
                score_home=int(row['FTHG']),  # Goles local
                score_away=int(row['FTAG']),  # Goles visitante
                fecha=str(row['Date']),      # Fecha del partido
                hora=str(row['Time']),       # Hora del partido
                estadio="N/A"                # football-data no siempre trae estadio, lo dejamos así
            )
            db.session.add(nuevo_partido)

        db.session.commit()
        print(f"✅ ¡Éxito! Importados {len(df)} partidos de {liga_nombre}.")


if __name__ == "__main__":
    # Asegúrate de que el nombre del archivo coincida exactamente
    archivo = "data/SP1-2024-2025.csv"
    importar_csv(archivo, "La Liga")
