import json
import os
import glob
from src.app import db, app, Partido, Evento


def cargar_jornada(liga, temp, jornada, partidos_data):
    try:
        for p in partidos_data:
            nuevo_partido = Partido(
                liga=liga,
                temporada=temp,
                jornada=jornada,
                home_team=p['home'],
                away_team=p['away'],
                score_home=p['score_h'],
                score_away=p['score_a'],
                fecha=p.get('fecha', 'N/A'),
                hora=p.get('hora', 'N/A'),
                estadio=p.get('estadio', 'No especificado')

            )
            db.session.add(nuevo_partido)
            db.session.flush()  # Necesario para obtener el ID antes del commit

            for ev in p.get('eventos', []):
                nuevo_evento = Evento(
                    tipo=ev['tipo'],
                    jugador=ev['jugador'],
                    minuto=ev['minuto'],
                    partido_id=nuevo_partido.id
                )
                db.session.add(nuevo_evento)

        db.session.commit()
        print(f"✅ Jornada {jornada} guardada con éxito con datos ampliados.")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error crítico al guardar jornada {jornada}: {e}")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        archivos = sorted(glob.glob("data/jornada*.json"))

        if not archivos:
            print("No se encontraron archivos en 'data/'.")

        for archivo in archivos:
            nombre = os.path.basename(archivo)
            num_jornada = "".join(filter(str.isdigit, nombre))

            try:
                with open(archivo, 'r', encoding='utf-8') as f:
                    datos = json.load(f)
                    print(f"DEBUG: Cargando {len(datos)} partidos de {nombre}")
                    cargar_jornada("PD", "2024-2025", int(num_jornada), datos)
            except Exception as e:
                print(f"❌ Error al abrir {nombre}: {e}")

    print("¡Proceso de carga finalizado!")
