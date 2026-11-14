<div align="center">

# ⚽ Predicador de Fútbol

**Aplicación Web Full Stack para gestión de ligas, partidos y pronósticos deportivos.**

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 💡 Sobre el Proyecto

Aplicación colaborativa desarrollada en el bootcamp de **4Geeks Academy**. Permite consultar calendarios de partidos, gestionar jornadas y realizar predicciones de fútbol mediante una interfaz dinámica conectada a una API RESTful robusta.

## ⚙️ Arquitectura y Tecnologías

* **Frontend:** Interfaz de usuario interactiva desarrollada con **React** y componentes modernos.
* **Backend:** API REST construida en **Python** con **Flask** para la gestión de lógica de negocio y rutas.
* **Base de Datos:** Modelo relacional gestionado con **PostgreSQL** y **SQLAlchemy** como ORM.
* **Automatización:** Scripts personalizados en Python (`cargar_temporada.py`, `load_data.py`) para la carga y migración masiva de datos deportivos.

## 👥 Colaboración y Aportación

Proyecto realizado en equipo bajo control de versiones con Git. Mi participación principal abarcó el desarrollo de la lógica en el frontend, la integración de componentes interactivos y la colaboración en la estructura de datos.

## 🚀 Instalación Local

Para levantar el proyecto en tu entorno de desarrollo:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/danieltauil20/Predicador-de-Futbol-final.git](https://github.com/danieltauil20/Predicador-de-Futbol-final.git)
   cd Predicador-de-Futbol-final

   pipenv install
cp .env.example .env
pipenv run upgrade
pipenv run start

npm install
npm run start
