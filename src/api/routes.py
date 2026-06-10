"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Prediction, Comment, Favorite
from api.utils import generate_sitemap, APIException
from sqlalchemy import func
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import urllib.request
import xml.etree.ElementTree as ET
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import os
import time
from datetime import datetime, timezone, timedelta

api = Blueprint('api', __name__)

FOOTBALL_API_BASE_URL = "https://api.football-data.org/v4/competitions"
API_TOKEN = "7fc4c822095b45d590fa0cd500eb3d5f"

cache_partidos = []
ultima_actualizacion = None
CACHE_DURACION_SEGUNDOS = 600

LIGAS_PERMITIDAS = ["PD", "PL", "BL1", "SA", "WC"]
HEADERS = {"X-Auth-Token": API_TOKEN}
MAPEO_LIGAS = {"PD": "PD", "PL": "PL", "SA": "SA", "BL": "BL1", "WC": "WC"}

# =========================================================
# 💬 COMMENTS CRUD (AÑADIDO POR COMPAÑEROS)
# =========================================================

@api.route('/comments', methods=['POST'])
def create_comment():
    data = request.get_json()

    if not data or not data.get("user_id") or not data.get("match_id") or not data.get("content"):
        return jsonify({"error": "Datos incompletos"}), 400

    user = User.query.get(data["user_id"])
    if not user:
        return jsonify({"error": "Usuario no existe"}), 404

    new_comment = Comment(
        user_id=data["user_id"],
        match_id=data["match_id"],
        content=data["content"]
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify(new_comment.serialize()), 201

@api.route('/comments', methods=['GET'])
def get_all_comments():
    comments = Comment.query.all()
    return jsonify([c.serialize() for c in comments]), 200

@api.route('/comments/match/<int:match_id>', methods=['GET'])
def get_comments_by_match(match_id):
    comments = Comment.query.filter_by(match_id=match_id).all()
    return jsonify([c.serialize() for c in comments]), 200

@api.route('/comments/user/<int:user_id>', methods=['GET'])
def get_comments_by_user(user_id):
    comments = Comment.query.filter_by(user_id=user_id).all()
    return jsonify([c.serialize() for c in comments]), 200

@api.route('/comments/<int:id>', methods=['PUT'])
def update_comment(id):
    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404

    data = request.get_json()
    comment.content = data.get("content", comment.content)

    db.session.commit()

    return jsonify(comment.serialize()), 200

@api.route('/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"msg": "Comentario eliminado"}), 200

# =========================================================
# ⭐ FAVORITES CRUD (AÑADIDO POR COMPAÑEROS)
# =========================================================

@api.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()

    if not data or not data.get("user_id") or not data.get("team_name"):
        return jsonify({"error": "Datos incompletos"}), 400

    user = User.query.get(data["user_id"])
    if not user:
        return jsonify({"error": "Usuario no existe"}), 404

    existing = Favorite.query.filter_by(
        user_id=data["user_id"],
        team_name=data["team_name"]
    ).first()

    if existing:
        return jsonify({"msg": "Este equipo ya está en favoritos"}), 200

    new_fav = Favorite(
        user_id=data["user_id"],
        team_name=data["team_name"]
    )

    db.session.add(new_fav)
    db.session.commit()

    return jsonify(new_fav.serialize()), 201

@api.route('/favorites', methods=['GET'])
def get_all_favorites():
    favorites = Favorite.query.all()
    return jsonify([f.serialize() for f in favorites]), 200

@api.route('/favorites/user/<int:user_id>', methods=['GET'])
def get_user_favorites(user_id):
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.serialize() for f in favorites]), 200

@api.route('/favorites/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    fav = Favorite.query.get(id)

    if not fav:
        return jsonify({"error": "Favorito no encontrado"}), 404

    db.session.delete(fav)
    db.session.commit()

    return jsonify({"msg": "Favorito eliminado"}), 200

# =========================================================
# 👤 USERS PRO (AÑADIDO POR COMPAÑEROS)
# =========================================================

# @api.route('/users/register', methods=['POST'])
# def register_user():
#     data = request.get_json()
#
#     if not data or not data.get("email") or not data.get("password"):
#         return jsonify({"error": "Datos incompletos"}), 400
#
#     existing = User.query.filter_by(email=data["email"]).first()
#     if existing:
#         return jsonify({"error": "Email ya registrado"}), 400
#
#     new_user = User(
#         email=data["email"],
#         password=generate_password_hash(data["password"])
#     )
#
#     db.session.add(new_user)
#     db.session.commit()
#
#     return jsonify({
#         "msg": "Usuario creado correctamente",
#         "user": new_user.serialize()
#     }), 201

# @api.route('/users/login', methods=['POST'])
# def login_user():
#     data = request.get_json()
#
#     if not data or not data.get("email") or not data.get("password"):
#         return jsonify({"error": "Datos incompletos"}), 400
#
#     user = User.query.filter_by(email=data["email"]).first()
#
#     if not user or not check_password_hash(user.password, data["password"]):
#         return jsonify({"error": "Credenciales incorrectas"}), 401
#
#     return jsonify({
#         "msg": "Login correcto",
#         "user": user.serialize()
#     }), 200

@api.route('/users/<int:id>/profile', methods=['GET'])
def get_user_profile(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    predictions = Prediction.query.filter_by(user_id=id).all()
    comments = Comment.query.filter_by(user_id=id).all()
    favorites = Favorite.query.filter_by(user_id=id).all()

    return jsonify({
        "user": user.serialize(),
        "predictions": [p.serialize() for p in predictions],
        "comments": [c.serialize() for c in comments],
        "favorites": [f.serialize() for f in favorites]
    }), 200

@api.route('/users/<int:id>/stats', methods=['GET'])
def get_user_stats(id):
    predictions = Prediction.query.filter_by(user_id=id).all()

    total = len(predictions)
    puntos = sum(p.points_earned or 0 for p in predictions)

    return jsonify({
        "total_predictions": total,
        "total_points": puntos
    }), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200

@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200

@api.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    user.email = data.get("email", user.email)

    if data.get("password"):
        user.password = generate_password_hash(data["password"])

    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado"}), 200

# =========================================================
# ENDPOINTS DE AUTENTICACIÓN (JWT - QUINIELA)
# =========================================================

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get("email", None)
    username = body.get("username", None)
    password = body.get("password", None)

    if not email or not password or not username:
        return jsonify({"msg": "Missing email, username or password"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, username=username, password=hashed_password, is_active=True)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get("email", None)
    password = body.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token, user=user.serialize()), 200

# =========================================================
# ENDPOINTS PÚBLICOS DE FÚTBOL
# =========================================================

@api.route('/api/fixtures/historico', methods=['GET'])
def get_historico():
    liga = request.args.get('liga', 'PD')
    temporada = request.args.get('temporada', '2025')
    if liga == "WC":
        return jsonify([]), 200
    id_liga = MAPEO_LIGAS.get(liga, "PD")
    url = f"https://api.football-data.org/v4/competitions/{id_liga}/matches?season={temporada}"
    res = requests.get(url, headers=HEADERS)
    return jsonify(res.json().get("matches", [])), 200

@api.route('/api/partido/detalle/<partido_id>', methods=['GET'])
def get_detalle_partido(partido_id):
    return jsonify({"goles": [{"jugador": "Jugador 1"}, {"jugador": "Jugador 2"}], "tarjetas": [{"jugador": "Jugador 3"}]})

@api.route('/fixtures', methods=['GET'])
def get_fixtures():
    global cache_partidos, ultima_actualizacion
    ahora = datetime.now(timezone.utc)
    if cache_partidos and ultima_actualizacion and (ahora - ultima_actualizacion).total_seconds() < CACHE_DURACION_SEGUNDOS:
        return jsonify(cache_partidos), 200

    hoy_utc = datetime.now(timezone.utc)
    en_una_semana_utc = hoy_utc + timedelta(days=7)
    params = {"dateFrom": hoy_utc.strftime('%Y-%m-%d'), "dateTo": en_una_semana_utc.strftime('%Y-%m-%d')}
    nuevos_partidos = []

    for codigo in LIGAS_PERMITIDAS:
        try:
            url_liga = f"{FOOTBALL_API_BASE_URL}/{codigo}/matches"
            response = requests.get(url_liga, headers=HEADERS, params=params)
            if response.status_code == 200:
                data = response.json()
                for item in data.get('matches', []):
                    status = item.get('status')
                    fecha_partido_str = item.get('utcDate')
                    fecha = fecha_partido_str[:10] if fecha_partido_str else ""
                    hora = fecha_partido_str[11:16] if fecha_partido_str and len(fecha_partido_str) > 16 else "00:00"
                    
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
                                "crest": item.get('homeTeam', {}).get('crest')
                            },
                            "away": {
                                "name": item.get('awayTeam', {}).get('name', 'Visitante'),
                                "crest": item.get('awayTeam', {}).get('crest')
                            }
                        }
                    }
                    nuevos_partidos.append(partido_formateado)
            time.sleep(0.5)
        except Exception as e:
            continue

    if nuevos_partidos:
        nuevos_partidos.sort(key=lambda x: (x.get('fecha') or '', x.get('hora') or '00:00'))
        cache_partidos = nuevos_partidos
        ultima_actualizacion = ahora

    return jsonify(cache_partidos), 200

# =========================================================
# ENDPOINTS PROTEGIDOS: PREDICCIONES
# =========================================================

@api.route('/predictions', methods=['POST'])
@jwt_required()
def save_prediction():
    body = request.get_json()
    if not body or 'predictions' not in body:
        return jsonify({"msg": "Formato inválido"}), 400

    predictions_data = body['predictions']
    current_user_id = get_jwt_identity()
    saved_predictions = []

    for pred in predictions_data:
        fixture_id = pred.get("fixture_id")
        home_goals = pred.get("home_goals")
        away_goals = pred.get("away_goals")
        
        home_team_name = pred.get("home_team_name", "Local")
        away_team_name = pred.get("away_team_name", "Visitante")
        home_team_logo = pred.get("home_team_logo", "")
        away_team_logo = pred.get("away_team_logo", "")

        if fixture_id is None or home_goals is None or away_goals is None:
            continue

        existing_prediction = Prediction.query.filter_by(user_id=current_user_id, fixture_id=fixture_id).first()

        if existing_prediction:
            existing_prediction.home_goals = home_goals
            existing_prediction.away_goals = away_goals
            existing_prediction.home_team_name = home_team_name
            existing_prediction.away_team_name = away_team_name
            existing_prediction.home_team_logo = home_team_logo
            existing_prediction.away_team_logo = away_team_logo
            saved_predictions.append(existing_prediction)
        else:
            new_prediction = Prediction(
                user_id=current_user_id,
                fixture_id=fixture_id,
                home_goals=home_goals,
                away_goals=away_goals,
                home_team_name=home_team_name,
                away_team_name=away_team_name,
                home_team_logo=home_team_logo,
                away_team_logo=away_team_logo
            )
            db.session.add(new_prediction)
            saved_predictions.append(new_prediction)

    db.session.commit()
    result = [p.serialize() for p in saved_predictions]
    return jsonify({"msg": "Predicciones guardadas", "predictions": result}), 201

@api.route('/predictions/me', methods=['GET'])
@jwt_required()
def get_my_predictions():
    current_user_id = get_jwt_identity()
    my_preds = Prediction.query.filter_by(user_id=current_user_id).order_by(Prediction.id.desc()).all()
    return jsonify([p.serialize() for p in my_preds]), 200

# =========================================================
# RANKING Y EVALUADOR
# =========================================================

@api.route('/ranking', methods=['GET'])
def get_ranking():
    try:
        results = db.session.query(
            User.id,
            User.username,
            User.email,
            func.sum(Prediction.points_earned).label('total_points')
        ).outerjoin(Prediction, User.id == Prediction.user_id).group_by(User.id, User.username, User.email).all()

        ranking = []
        for r in results:
            username = r.username if r.username else r.email.split('@')[0]
            points = (int(r.total_points) if r.total_points is not None else 0) + 30
            ranking.append({
                "user_id": r.id,
                "username": username,
                "points": points
            })

        ranking.sort(key=lambda x: (-x['points'], x['username'].lower()))
        ranking = ranking[:100]
        for index, user in enumerate(ranking):
            user['rank'] = index + 1

        return jsonify(ranking), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500

@api.route('/evaluate', methods=['POST'])
def evaluate_predictions():
    pending_predictions = Prediction.query.filter_by(points_earned=None).all()
    if not pending_predictions:
        return jsonify({"msg": "Todo al día"}), 200

    unique_fixtures = set([p.fixture_id for p in pending_predictions])
    API_KEY = os.getenv("VITE_API_KEY", API_TOKEN)
    headers = {"X-Auth-Token": API_KEY}
    evaluated_count = 0

    for fixture_id in unique_fixtures:
        url = f"https://api.football-data.org/v4/matches/{fixture_id}"
        try:
            response = requests.get(url, headers=headers)
            if response.status_code != 200: continue
            match_data = response.json()
            if match_data.get('status') not in ['FINISHED', 'AWARDED']: continue
            
            real_home = match_data['score']['fullTime']['home']
            real_away = match_data['score']['fullTime']['away']
            if real_home is None or real_away is None: continue

            if real_home > real_away: real_winner = 1
            elif real_home < real_away: real_winner = -1
            else: real_winner = 0

            fixture_predictions = [p for p in pending_predictions if p.fixture_id == fixture_id]
            for pred in fixture_predictions:
                if pred.home_goals == real_home and pred.away_goals == real_away:
                    pred.points_earned = 3
                else:
                    if pred.home_goals > pred.away_goals: pred_winner = 1
                    elif pred.home_goals < pred.away_goals: pred_winner = -1
                    else: pred_winner = 0

                    if pred_winner == real_winner: pred.points_earned = 1
                    else: pred.points_earned = 0

                evaluated_count += 1
        except Exception as e:
            continue

    db.session.commit()
    return jsonify({"msg": f"Se evaluaron {evaluated_count} predicciones."}), 200

@api.route('/stats', methods=['GET'])
def get_stats():
    try:
        total_users = User.query.count()
        online_users = max(1, total_users // 3)
        return jsonify({"total": total_users, "online": online_users}), 200
    except Exception as e:
        return jsonify({"msg": "Error al cargar stats", "error": str(e)}), 500

# =========================================================
# NOTICIAS CON LIMPIEZA HTML
# =========================================================

@api.route('/news', methods=['GET'])
def get_news():
    try:
        import re
        import html

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
                    
                    clean_title = html.unescape(raw_title)
                    decoded_description = html.unescape(raw_description)
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
                        "title": clean_title, 
                        "description": clean_description[:120] + "..." if len(clean_description) > 120 else clean_description,
                        "image": image,
                        "link": link,
                        "tag": "Mundial" if "mundial" in clean_title.lower() else feed["tag"],
                        "source": "MARCA",
                        "date": "Reciente"
                    })
            except Exception as e:
                continue 
                
        return jsonify(all_news[:8]), 200 
    except Exception as e:
        return jsonify({"msg": "Error general al cargar noticias", "error": str(e)}), 500

