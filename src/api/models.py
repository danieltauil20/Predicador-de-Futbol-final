from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)

    # NUEVO: Relación de 1 a Muchos (Un usuario -> Muchas predicciones)
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # NOTA: No serializamos la contraseña por seguridad
        }

# NUEVO MODELO: Tabla para guardar las quinielas de los usuarios
class Prediction(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    
    # Llave foránea: ¿De qué usuario es esta predicción?
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False)
    
    # ID del partido (el mismo que viene de la API de football-data)
    fixture_id: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Goles predichos
    home_goals: Mapped[int] = mapped_column(Integer, nullable=False)
    away_goals: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Puntos ganados (Inicia vacío, se llena cuando el partido termina en la vida real)
    points_earned: Mapped[int] = mapped_column(Integer, nullable=True)

    # Relación inversa para poder acceder al usuario desde la predicción
    user = relationship("User", back_populates="predictions")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "fixture_id": self.fixture_id,
            "home_goals": self.home_goals,
            "away_goals": self.away_goals,
            "points_earned": self.points_earned
        }
        
class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    match_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(500), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "match_id": self.match_id,
            "content": self.content
        }

class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", backref="favorites")
    team_name = db.Column(db.String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "team_name": self.team_name
        }