from src.app import app, db, Partido

# Esto le dice a Python que trabaje con nuestra base de datos
with app.app_context():
    # Pedimos todos los partidos que ya cargamos
    partidos = Partido.query.all()
    
    # Vamos a numerarlos. 
    # El bucle va del 0 al 379. 
    # Usamos (i // 10) para que cada 10 partidos cambie el número de jornada.
    for i, p in enumerate(partidos):
        p.jornada = (i // 10) + 1
    
    # Guardamos los cambios en la base de datos
    db.session.commit()
    print("✅ ¡Listo! Hemos etiquetado los 380 partidos con su número de jornada.")