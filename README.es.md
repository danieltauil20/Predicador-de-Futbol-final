⚽ Predicador de Fútbol (Full Stack App)

Aplicación web Full Stack desarrollada como proyecto colaborativo en el bootcamp de 4Geeks Academy. Permite la gestión de temporadas, partidos y pronósticos de fútbol mediante una arquitectura robusta con backend en Python/Flask y frontend interactivo en React.

🛠️ Stack Tecnológico

Frontend:   

Backend:  

Base de Datos & ORM:  

Herramientas & Despliegue:   

🎯 Características Principales

Arquitectura Full Stack: API RESTful en Flask conectada a una base de datos relacional PostgreSQL mediante SQLAlchemy.

Gestión de Datos Deportivos: Scripts automatizados en Python para la carga y migración de datos de temporadas y partidos (cargar_temporada.py, load_data.py).

Interfaz Dinámica en React: Vistas interactivas para el usuario, consultas de jornadas y visualización de pronósticos de fútbol.

Control de Versiones y Trabajo en Equipo: Desarrollo colaborativo utilizando Git bajo un flujo estructurado de ramas.

👥 Contribuciones del Equipo

Proyecto desarrollado en equipo en 4Geeks Academy. Mi aportación principal incluyó el desarrollo de componentes del frontend, la lógica de interacción en JavaScript y la colaboración en la integración con el backend.

🚀 Instalación y Ejecución Local

Si deseas clonar y probar el proyecto en tu entorno local:

1. Clonar el repositorio

git clone https://github.com/danieltauil20/Predicador-de-Futbol-final.git
cd Predicador-de-Futbol-final


2. Configurar el Backend (Python / Flask)

Asegúrate de tener Python 3.10 y Pipenv instalados:

# Instalar dependencias de Python
pipenv install

# Crear archivo de entorno a partir del ejemplo
cp .env.example .env

# Ejecutar las migraciones de base de datos
pipenv run upgrade

# Iniciar el servidor backend
pipenv run start


3. Configurar el Frontend (React)

En otra pestaña de la terminal, asegúrate de tener Node.js (versión 20 recomendada):

# Instalar dependencias de Node
npm install

# Iniciar el servidor de desarrollo de frontend
npm run start
