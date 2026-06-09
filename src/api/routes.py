
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

import time
import requests
from datetime import datetime, timezone, timedelta
from flask import Flask, request, jsonify, url_for, Blueprint
# NUEVO: Asegúrate de importar Prediction además de User
from api.models import db, User, Prediction, Comment, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

FOOTBALL_API_BASE_URL = "https://api.football-data.org/v4/competitions"
API_TOKEN = "7fc4c822095b45d590fa0cd500eb3d5f"  # 🔑 REEMPLAZA CON TU TOKEN REAL

cache_partidos = []
ultima_actualizacion = None
CACHE_DURACION_SEGUNDOS = 600

LIGAS_PERMITIDAS = ["PD", "PL", "BL1", "SA", "WC"]


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


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

    user_id = body.get("user_id")
    if not user_id:
      return jsonify({"msg": "Falta user_id"}), 400

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
# 💬 COMMENTS CRUD
# =========================================================

# CREATE comentario


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


# GET todos los comentarios
@api.route('/comments', methods=['GET'])
def get_all_comments():
    comments = Comment.query.all()
    return jsonify([c.serialize() for c in comments]), 200


# GET comentarios por partido
@api.route('/comments/match/<int:match_id>', methods=['GET'])
def get_comments_by_match(match_id):
    comments = Comment.query.filter_by(match_id=match_id).all()
    return jsonify([c.serialize() for c in comments]), 200


# GET comentarios por usuario
@api.route('/comments/user/<int:user_id>', methods=['GET'])
def get_comments_by_user(user_id):
    comments = Comment.query.filter_by(user_id=user_id).all()
    return jsonify([c.serialize() for c in comments]), 200


# UPDATE comentario
@api.route('/comments/<int:id>', methods=['PUT'])
def update_comment(id):
    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404

    data = request.get_json()
    comment.content = data.get("content", comment.content)

    db.session.commit()

    return jsonify(comment.serialize()), 200


# DELETE comentario
@api.route('/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"error": "Comentario no encontrado"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"msg": "Comentario eliminado"}), 200


# =========================================================
# ⭐ FAVORITES CRUD
# =========================================================

# CREATE favorito
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


# GET todos los favoritos
@api.route('/favorites', methods=['GET'])
def get_all_favorites():
    favorites = Favorite.query.all()
    return jsonify([f.serialize() for f in favorites]), 200


# GET favoritos de un usuario
@api.route('/favorites/user/<int:user_id>', methods=['GET'])
def get_user_favorites(user_id):
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.serialize() for f in favorites]), 200


# DELETE favorito
@api.route('/favorites/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    fav = Favorite.query.get(id)

    if not fav:
        return jsonify({"error": "Favorito no encontrado"}), 404

    db.session.delete(fav)
    db.session.commit()

    return jsonify({"msg": "Favorito eliminado"}), 200

  # =========================================================
# 👤 USERS PRO (APP FÚTBOL)
# =========================================================

# REGISTER


@api.route('/users/register', methods=['POST'])
def register_user():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Datos incompletos"}), 400

    existing = User.query.filter_by(email=data["email"]).first()
    if existing:
        return jsonify({"error": "Email ya registrado"}), 400

    new_user = User(
        email=data["email"],
        password=generate_password_hash(data["password"])
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg": "Usuario creado correctamente",
        "user": new_user.serialize()
    }), 201


# LOGIN
@api.route('/users/login', methods=['POST'])
def login_user():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Datos incompletos"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    return jsonify({
        "msg": "Login correcto",
        "user": user.serialize()
    }), 200


# PROFILE
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


# STATS
@api.route('/users/<int:id>/stats', methods=['GET'])
def get_user_stats(id):
    predictions = Prediction.query.filter_by(user_id=id).all()

    total = len(predictions)
    puntos = sum(p.points_earned or 0 for p in predictions)

    return jsonify({
        "total_predictions": total,
        "total_points": puntos
    }), 200

# =========================================================
# 👤 USERS CRUD (LO QUE TE FALTABA)
# =========================================================

# GET todos los usuarios


@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200


# GET un usuario
@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200


# UPDATE usuario
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


# DELETE usuario
@api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado"}), 200
