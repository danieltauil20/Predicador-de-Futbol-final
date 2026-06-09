from src.app import db, app, Partido, Evento


def reset_db():
    with app.app_context():
        # Borra todo y crea las tablas desde cero
        db.drop_all()
        db.create_all()

        # Insertar un partido de prueba
        p1 = Partido(
            liga="PD",
            temporada="2024-2025",
            jornada=1,
            home_team="Real Madrid",
            away_team="FC Barcelona",
            score_home=2,
            score_away=1
        )
        db.session.add(p1)
        db.session.commit()

        # Insertar un evento
        e1 = Evento(tipo="gol", jugador="Mbappe",
                    minuto="45'", partido_id=p1.id)
        db.session.add(e1)
        db.session.commit()

        print("Base de datos creada y partido de prueba insertado con éxito.")


if __name__ == "__main__":
    reset_db()
