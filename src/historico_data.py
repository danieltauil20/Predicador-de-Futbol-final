# src/historico_data.py

# Códigos de ligas:
# PD = LaLiga (España) | PL = Premier League (Inglaterra)
# SA = Serie A (Italia) | BL = Bundesliga (Alemania)

PARTIDOS_HISTORICOS = {
    "PD": {  # === 🇪🇸 ESPAÑA: LALIGA (Jornadas 1 a 38) ===
        1: [
            {
                "id": "es_j1_1", "codigo_liga": "PD", "liga": "LaLiga", "estado": "FINISHED",
                "goals": {"home": 2, "away": 1},
                "teams": {
                    "home": {"name": "Real Madrid", "crest": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Real_Madrid_CF_logo.svg"},
                    "away": {"name": "Barcelona", "crest": "https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Barcelona_%28crest%29.svg"}
                },
                "events": [
                    {"minute": 14, "team": "home",
                        "player": "Vini Jr.", "type": "goal"},
                    {"minute": 32, "team": "away",
                        "player": "Gavi", "type": "yellow_card"},
                    {"minute": 68, "team": "home",
                        "player": "Mbappé", "type": "goal"}
                ]
            }
        ],
        2: [
            # Aquí sumas los partidos de la Jornada 2...
        ],
        # ... hasta la 38
    },
    "PL": {  # === 🏴󠁧󠁢󠁥󠁮󠁧󠁿 INGLATERRA: PREMIER LEAGUE (Jornadas 1 a 38) ===
        1: [
            {
                "id": "en_j1_1", "codigo_liga": "PL", "liga": "Premier League", "estado": "FINISHED",
                "goals": {"home": 0, "away": 2},
                "teams": {
                    "home": {"name": "Chelsea", "crest": "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg"},
                    "away": {"name": "Manchester City", "crest": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg"}
                },
                "events": [
                    {"minute": 25, "team": "away",
                        "player": "Haaland", "type": "goal"},
                    {"minute": 80, "team": "away",
                        "player": "Kovacic", "type": "goal"}
                ]
            }
        ]
    },
    "SA": {  # === 🇮🇹 ITALIA: SERIE A (Jornadas 1 a 38) ===
        1: [
            {
                "id": "it_j1_1", "codigo_liga": "SA", "liga": "Serie A", "estado": "FINISHED",
                "goals": {"home": 2, "away": 2},
                "teams": {
                    "home": {"name": "Inter", "crest": "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021_logo.svg"},
                    "away": {"name": "Genoa", "crest": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Genoa_C.F.C._logo.svg"}
                },
                "events": [
                    {"minute": 30, "team": "home",
                        "player": "Thuram", "type": "goal"}
                ]
            }
        ]
    },
    "BL": {  # === 🇩🇪 ALEMANIA: BUNDESLIGA (Jornadas 1 a 34) ===
        1: [
            {
                "id": "de_j1_1", "codigo_liga": "BL", "liga": "Bundesliga", "estado": "FINISHED",
                "goals": {"home": 3, "away": 2},
                "teams": {
                    "home": {"name": "Bayer Leverkusen", "crest": "https://upload.wikimedia.org/wikipedia/de/f/f7/Bayer_Leverkusen_Logo.svg"},
                    "away": {"name": "Monchengladbach", "crest": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Borussia_M%C3%B6nchengladbach_Logo.svg"}
                },
                "events": [
                    {"minute": 12, "team": "home",
                        "player": "Xhaka", "type": "goal"},
                    {"minute": 88, "team": "home", "player": "Wirtz", "type": "goal"}
                ]
            }
        ]
    }
}
