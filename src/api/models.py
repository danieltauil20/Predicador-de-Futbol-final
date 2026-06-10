from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    predictions = relationship(
        "Prediction", back_populates="user", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
        }


class Prediction(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=False)
    fixture_id: Mapped[int] = mapped_column(Integer, nullable=False)

    home_goals: Mapped[int] = mapped_column(Integer, nullable=False)
    away_goals: Mapped[int] = mapped_column(Integer, nullable=False)

    home_team_name: Mapped[str] = mapped_column(String(100), nullable=True)
    away_team_name: Mapped[str] = mapped_column(String(100), nullable=True)
    home_team_logo: Mapped[str] = mapped_column(String(300), nullable=True)
    away_team_logo: Mapped[str] = mapped_column(String(300), nullable=True)

    points_earned: Mapped[int] = mapped_column(Integer, nullable=True)

    user = relationship("User", back_populates="predictions")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "fixture_id": self.fixture_id,
            "home_goals": self.home_goals,
            "away_goals": self.away_goals,
            "home_team_name": self.home_team_name,
            "away_team_name": self.away_team_name,
            "home_team_logo": self.home_team_logo,
            "away_team_logo": self.away_team_logo,
            "points_earned": self.points_earned
        }

# TABLAS NUEVAS


class Comment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=False)
    match_id: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(String(500), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "match_id": self.match_id,
            "content": self.content
        }


class Favorite(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=False)
    team_name: Mapped[str] = mapped_column(String(100), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "team_name": self.team_name
        }
