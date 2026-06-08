from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from api.models import db
from api.routes import api

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)

    app.register_blueprint(api, url_prefix='/api')

    return app