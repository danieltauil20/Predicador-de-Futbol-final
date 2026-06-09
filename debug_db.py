from src.app import app, Partido

with app.app_context():
    p = Partido.query.first()
    if p:
        print(f"✅ ¡Base de datos con datos!")
        print(f"Liga encontrada: '{p.liga}'")
        print(f"Temporada encontrada: '{p.temporada}'")
    else:
        print("❌ La base de datos está totalmente vacía.")