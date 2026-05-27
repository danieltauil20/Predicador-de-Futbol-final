import json
import os # Añade esto arriba con los otros imports
from src.app import db, app, Partido, Evento

# ... (mantén tu función cargar_jornada igual) ...

if __name__ == "__main__":
    # Obtiene la ruta de la carpeta donde está este script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define el nombre del archivo
    nombre_archivo = 'jornada2.json'
    
    # Crea la ruta completa: carpeta_actual/jornada2.json
    ruta_completa = os.path.join(base_dir, nombre_archivo)
    
    numero_jornada = 2 
    
    try:
        # Imprimimos la ruta que está buscando para depurar
        print(f"Buscando archivo en: {ruta_completa}")
        
        with open(ruta_completa, 'r', encoding='utf-8') as f:
            datos = json.load(f)
        
        cargar_jornada("PD", "2024-2025", numero_jornada, datos)
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo en {ruta_completa}")
    except Exception as e:
        print(f"Ocurrió un error: {e}")