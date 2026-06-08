"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
# NUEVO: Asegúrate de importar Prediction además de User
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Prediction
from api.utils import generate_sitemap, APIException
from sqlalchemy import func
from flask_cors import CORS
import urllib.request
import xml.etree.ElementTree as ET
api = Blueprint('api', __name__)

FOOTBALL_API_BASE_URL = "https://api.football-data.org/v4/competitions"
API_TOKEN = "7fc4c822095b45d590fa0cd500eb3d5f"  # 🔑 REEMPLAZA CON TU TOKEN REAL

cache_partidos = []
ultima_actualizacion = None
CACHE_DURACION_SEGUNDOS = 600

LIGAS_PERMITIDAS = ["PD", "PL", "BL1", "SA", "WC"]

HEADERS = {"X-Auth-Token": API_TOKEN}
MAPEO_LIGAS = {"PD": "PD", "PL": "PL", "SA": "SA", "BL": "BL1", "WC": "WC"}


@api.route('/api/fixtures/historico', methods=['GET'])
def get_historico():
    liga = request.args.get('liga', 'PD')
    temporada = request.args.get('temporada', '2025')

    # Si es Mundial, devolvemos datos vacíos o tu JSON local
    if liga == "WC":
        return jsonify([]), 200

    id_liga = MAPEO_LIGAS.get(liga, "PD")
    url = f"https://api.football-data.org/v4/competitions/{id_liga}/matches?season={temporada}"

    res = requests.get(url, headers=HEADERS)
    return jsonify(res.json().get("matches", [])), 200


@api.route('/api/partido/detalle/<partido_id>', methods=['GET'])
def get_detalle_partido(partido_id):
    # Simulamos datos para el detalle
    return jsonify({
        "goles": [{"jugador": "Jugador 1"}, {"jugador": "Jugador 2"}],
        "tarjetas": [{"jugador": "Jugador 3"}]
    })


@api.route('/fixtures', methods=['GET'])
def get_fixtures():
    global cache_partidos, ultima_actualizacion
    ahora = datetime.now(timezone.utc)

    if cache_partidos and ultima_actualizacion and (ahora - ultima_actualizacion).total_seconds() < CACHE_DURACION_SEGUNDOS:
        return jsonify(cache_partidos), 200

    hoy_utc = datetime.now(timezone.utc)
    en_una_semana_utc = hoy_utc + timedelta(days=7)

    params = {
        "dateFrom": hoy_utc.strftime('%Y-%m-%d'),
        "dateTo": en_una_semana_utc.strftime('%Y-%m-%d')
    }
    headers = {"X-Auth-Token": API_TOKEN}
    nuevos_partidos = []

    for codigo in LIGAS_PERMITIDAS:
        try:
            url_liga = f"{FOOTBALL_API_BASE_URL}/{codigo}/matches"
            response = requests.get(url_liga, headers=headers, params=params)

            if response.status_code == 200:
                data = response.json()
                for item in data.get('matches', []):
                    status = item.get('status')
                    fecha_partido_str = item.get('utcDate')

                    fecha = fecha_partido_str[:10] if fecha_partido_str else ""
                    hora = fecha_partido_str[11:16] if fecha_partido_str and len(
                        fecha_partido_str) > 16 else "00:00"

                    partido_formateado = {
                        "id": item.get('id'),
                        "liga": data.get('competition', {}).get('name', 'Competición'),
                        "codigo_liga": codigo,
                        "fecha": fecha,
                        "hora": hora,
                        "estado": status,
                        "minuto": "",
                        "goals": {
                            "home": item.get('score', {}).get('fullTime', {}).get('home', 0) if item.get('score', {}).get('fullTime', {}).get('home') is not None else 0,
                            "away": item.get('score', {}).get('fullTime', {}).get('away', 0) if item.get('score', {}).get('fullTime', {}).get('away') is not None else 0
                        },
                        "teams": {
                            "home": {
                                "name": item.get('homeTeam', {}).get('name', 'Local'),
                                # 🛡️ Escudo/Bandera Local
                                "crest": item.get('homeTeam', {}).get('crest')
                            },
                            "away": {
                                "name": item.get('awayTeam', {}).get('name', 'Visitante'),
                                # 🛡️ Escudo/Bandera Visitante
                                "crest": item.get('awayTeam', {}).get('crest')
                            }
                        }
                    }
                    nuevos_partidos.append(partido_formateado)

            time.sleep(0.5)
        except Exception as e:
            print(f"❌ Error procesando liga {codigo}: {e}")
            continue

    if nuevos_partidos:
        nuevos_partidos.sort(key=lambda x: (
            x.get('fecha') or '', x.get('hora') or '00:00'))
        cache_partidos = nuevos_partidos
        ultima_actualizacion = ahora

    return jsonify(cache_partidos), 200


# =========================================================
# NUEVO ENDPOINT: RECIBIR Y GUARDAR PREDICCIONES
# =========================================================
@api.route('/predictions', methods=['POST'])
def save_prediction():
    body = request.get_json()

    if not body or 'predictions' not in body:
        return jsonify({"msg": "Formato inválido. Se esperaba un objeto con 'predictions'"}), 400

    predictions_data = body['predictions']

    user_id = 1

    saved_predictions = []

    for pred in predictions_data:
        fixture_id = pred.get("fixture_id")
        home_goals = pred.get("home_goals")
        away_goals = pred.get("away_goals")

        if fixture_id is None or home_goals is None or away_goals is None:
            continue  # Saltamos las predicciones que estén incompletas

        # 2. Buscamos si el usuario ya había hecho una predicción para este mismo partido
        existing_prediction = Prediction.query.filter_by(
            user_id=user_id, fixture_id=fixture_id).first()

        if existing_prediction:
            # Si ya existía, la sobrescribimos (Actualiza su predicción)
            existing_prediction.home_goals = home_goals
            existing_prediction.away_goals = away_goals
            saved_predictions.append(existing_prediction)
        else:
            # 3. Si no existía, creamos un registro completamente nuevo
            new_prediction = Prediction(
                user_id=user_id,
                fixture_id=fixture_id,
                home_goals=home_goals,
                away_goals=away_goals
            )
            db.session.add(new_prediction)
            saved_predictions.append(new_prediction)

    # 4. Guardamos los cambios físicamente en la Base de Datos
    db.session.commit()

    # 5. Le respondemos a React con los datos guardados
    result = [p.serialize() for p in saved_predictions]
    return jsonify({"msg": "Predicciones guardadas con éxito", "predictions": result}), 201

# =========================================================
# NUEVO ENDPOINT: OBTENER EL RANKING GLOBAL
# =========================================================


@api.route('/ranking', methods=['GET'])
def get_ranking():
    try:
        # Agregamos User.email al group_by para evitar que PostgreSQL se queje
        results = db.session.query(
            User.id,
            User.email,
            func.sum(Prediction.points_earned).label('total_points')
        ).outerjoin(Prediction, User.id == Prediction.user_id).group_by(User.id, User.email).all()

        ranking = []
        for r in results:
            username = r.email.split('@')[0]
            # Si un usuario se registra, obtiene 30 puntos por defecto
            points = (int(r.total_points)
                      if r.total_points is not None else 0) + 30

            ranking.append({
                "user_id": r.id,
                "username": username,
                "points": points
            })

        # Ordenamos primero por puntos (mayor a menor) y luego por username (A-Z) para desempatar
        ranking.sort(key=lambda x: (-x['points'], x['username'].lower()))

        # Limitamos a los mejores 100 usuarios para proteger la memoria de tus usuarios
        ranking = ranking[:100]

        # Asignamos la posición final (después de ordenar y cortar)
        for index, user in enumerate(ranking):
            user['rank'] = index + 1

        return jsonify(ranking), 200

    except Exception as e:
        # Si algo explota, le decimos a Flask que cancele la transacción corrupta y nos muestre el error exacto
        db.session.rollback()
        print("🚨 ERROR EN RANKING:", str(e))
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500


# =========================================================
# NUEVO ENDPOINT: EVALUADOR (CALCULAR PUNTOS)
# =========================================================

@api.route('/evaluate', methods=['POST'])
def evaluate_predictions():
    # 1. Buscamos todas las predicciones que el bot aún no ha calificado
    pending_predictions = Prediction.query.filter_by(points_earned=None).all()

    if not pending_predictions:
        return jsonify({"msg": "Todo al día. No hay predicciones pendientes por evaluar."}), 200

    # 2. Agrupamos los partidos para no hacerle la misma pregunta a la API 100 veces
    unique_fixtures = set([p.fixture_id for p in pending_predictions])

    API_KEY = os.getenv("VITE_API_KEY", "8a0aed89a11642cf9abd50eb19825215")
    headers = {"X-Auth-Token": API_KEY}

    evaluated_count = 0

    for fixture_id in unique_fixtures:
        url = f"https://api.football-data.org/v4/matches/{fixture_id}"

        try:
            # Le preguntamos a la API de Football-Data el resultado real
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                continue

            match_data = response.json()

            # Solo calificamos si el partido ya terminó en la vida real
            if match_data.get('status') not in ['FINISHED', 'AWARDED']:
                continue

            real_home = match_data['score']['fullTime']['home']
            real_away = match_data['score']['fullTime']['away']

            if real_home is None or real_away is None:
                continue

            # Determinamos la tendencia real (1=Local, -1=Visitante, 0=Empate)
            if real_home > real_away:
                real_winner = 1
            elif real_home < real_away:
                real_winner = -1
            else:
                real_winner = 0

            # 3. Traemos todas las predicciones de los usuarios para este partido en específico
            fixture_predictions = [
                p for p in pending_predictions if p.fixture_id == fixture_id]

            for pred in fixture_predictions:
                # 🥇 ACIERTO EXACTO (Marcador idéntico) -> 3 puntos
                if pred.home_goals == real_home and pred.away_goals == real_away:
                    pred.points_earned = 3
                else:
                    # Determinamos la tendencia que el usuario predijo
                    if pred.home_goals > pred.away_goals:
                        pred_winner = 1
                    elif pred.home_goals < pred.away_goals:
                        pred_winner = -1
                    else:
                        pred_winner = 0

                    # 🥈 ACIERTO PARCIAL (Atinó quién ganaba o si empataban) -> 1 punto
                    if pred_winner == real_winner:
                        pred.points_earned = 1
                    # 💔 FALLO TOTAL -> 0 puntos
                    else:
                        pred.points_earned = 0

                evaluated_count += 1

        except Exception as e:
            print(f"Error evaluando partido {fixture_id}: {str(e)}")
            continue

    # 4. Guardamos los puntos asignados en la base de datos física
    db.session.commit()

    return jsonify({"msg": f"Se evaluaron y calificaron {evaluated_count} predicciones nuevas."}), 200

# =========================================================
# ENDPOINT DE ESTADÍSTICAS GLOBALES
# =========================================================


@api.route('/stats', methods=['GET'])
def get_stats():
    try:
        total_users = User.query.count()
        # Como aún no tenemos un sistema de WebSockets para saber quién está online exactamente,
        # calculamos un estimado realista para la demostración (mínimo 1).
        online_users = max(1, total_users // 3)

        return jsonify({
            "total": total_users,
            "online": online_users
        }), 200
    except Exception as e:
        return jsonify({"msg": "Error al cargar las estadísticas", "error": str(e)}), 500


   # =========================================================
# NUEVO ENDPOINT: NOTICIAS MULTICANAL (RSS FEED)
# =========================================================
@api.route('/news', methods=['GET'])
def get_news():
    try:
        import re
        import html # 🔥 NUEVO: Herramienta para traducir códigos (ej. &#039; -> ')

        rss_urls = [
            {"url": "https://e00-marca.uecdn.es/rss/futbol/primera-division.xml", "tag": "La Liga"},
            {"url": "https://e00-marca.uecdn.es/rss/futbol/champions-league.xml", "tag": "Champions"},
            {"url": "https://e00-marca.uecdn.es/rss/futbol/futbol-internacional.xml", "tag": "Internacional"}
        ]
        
        all_news = []
        
        for feed in rss_urls:
            try:
                req = urllib.request.Request(feed["url"], headers={'User-Agent': 'Mozilla/5.0'})
                response = urllib.request.urlopen(req)
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                
                for index, item in enumerate(root.findall('.//item')[:3]):
                    raw_title = item.find('title').text if item.find('title') is not None else "Noticia"
                    link = item.find('link').text if item.find('link') is not None else "#"
                    raw_description = item.find('description').text if item.find('description') is not None else ""
                    
                    # 🔥 PASO 1: Traducimos los códigos raros a texto normal en el título y descripción
                    clean_title = html.unescape(raw_title)
                    decoded_description = html.unescape(raw_description)
                    
                    # 🔥 PASO 2: Eliminamos etiquetas HTML basura (<a href...>)
                    clean_description = re.sub(r'<[^>]+>', '', decoded_description).strip()
                    
                    image = "https://images.unsplash.com/photo-1518605368461-12503a45c711?q=80&w=600&auto=format&fit=crop"
                    enclosure = item.find('enclosure')
                    if enclosure is not None and enclosure.get('url'):
                        image = enclosure.get('url')
                    else:
                        media = item.find('{http://search.yahoo.com/mrss/}content')
                        if media is not None and media.get('url'):
                            image = media.get('url')

                    all_news.append({
                        "id": f"{feed['tag']}-{index}", 
                        "title": clean_title, # Usamos el título limpio
                        "description": clean_description[:120] + "..." if len(clean_description) > 120 else clean_description,
                        "image": image,
                        "link": link,
                        "tag": "Mundial" if "mundial" in clean_title.lower() else feed["tag"],
                        "source": "MARCA",
                        "date": "Reciente"
                    })
            except Exception as e:
                print(f"Error cargando feed {feed['tag']}: {e}")
                continue 
                
        return jsonify(all_news[:8]), 200 
    except Exception as e:
        return jsonify({"msg": "Error general al cargar noticias", "error": str(e)}), 500