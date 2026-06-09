from src.app import app, Partido

with app.app_context():
    # Miramos cuántos partidos se han guardado
    cantidad = Partido.query.count()
    print(f"¡Genial! Hay {cantidad} partidos guardados en la biblioteca.")

    # Miramos solo el primero para ver cómo se ve
    ejemplo = Partido.query.first()
    print(f"Ejemplo: {ejemplo.home_team} vs {ejemplo.away_team} en la fecha {ejemplo.fecha}")