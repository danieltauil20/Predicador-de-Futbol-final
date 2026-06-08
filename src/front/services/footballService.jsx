const ELITE_LEAGUE_IDS = [
    140, // La Liga
    63,  // Premier League
    61,  // Ligue 1
    135, // Serie A
    78,  // Bundesliga
    1,   // Mundial FIFA
    2,   // Champions League
];

const BASE_URL = 'https://corsproxy.io/?https://api.football-data.org/v4'; 
const HEADERS = {
    'X-Auth-Token': import.meta.env.VITE_API_KEY, 
    'Content-Type': 'application/json'
};

export const footballService = {
    
    async getWeeklyEliteFixtures() {
        // === TIEMPO REAL AUTOMÁTICO ===
                const today = new Date();
        
        // REGLA DE LA API: Máximo 10 días de diferencia.
        // Haremos 3 días hacia atrás y 7 hacia adelante (3 + 7 = 10 días exactos).
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 3);
        
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 7);

        const formatDate = (d) => d.toISOString().split('T')[0];
        const dateFromStr = formatDate(pastDate);
        const dateToStr = formatDate(futureDate);

        const cacheKey = `gt_data_realtime_${dateFromStr}_${dateToStr}`; 
        
        const cached = localStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached);

        const competitions = '2014,2021,2015,2019,2002,2000,2001';
        const fetchUrl = `${BASE_URL}/matches?competitions=${competitions}&dateFrom=${dateFromStr}&dateTo=${dateToStr}`;

        try {
            const response = await fetch(fetchUrl, { headers: HEADERS });
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();

            // === DESCARGA DE RACHAS (Borrará el N/A) ===
            const activeLeagues = [...new Set((data.matches || []).map(m => m.competition.id))];
            const formsMap = {};

            await Promise.all(activeLeagues.map(async (leagueId) => {
                try {
                    const standingsRes = await fetch(`${BASE_URL}/competitions/${leagueId}/standings`, { headers: HEADERS });
                    if (!standingsRes.ok) return;
                    const standingsData = await standingsRes.json();
                    
                    const table = standingsData?.standings?.[0]?.table || [];
                    table.forEach(item => {
                        if (item.team?.id && item.form) {
                            formsMap[item.team.id] = item.form.replace(/,/g, '');
                        }
                    });
                } catch (e) {
                    console.error(`Error al cargar racha de liga ${leagueId}:`, e);
                }
            }));

            // === TRADUCCIÓN A FORMATO QUINIELA ===
            const translatedMatches = (data.matches || []).map(m => {
                let statusShort = 'NS'; 
                if (m.status === 'FINISHED') statusShort = 'FT'; 
                if (m.status === 'IN_PLAY') statusShort = 'LIVE'; 
                if (m.status === 'PAUSED') statusShort = 'HT'; 
                
                return {
                    fixture: { id: m.id, date: m.utcDate, status: { short: statusShort, elapsed: m.minute || 0 } },
                    league: { name: m.competition.name, flag: m.competition.emblem },
                    teams: {
                        home: { id: m.homeTeam.id, name: m.homeTeam.name, logo: m.homeTeam.crest },
                        away: { id: m.awayTeam.id, name: m.awayTeam.name, logo: m.awayTeam.crest }
                    },
                    score: { fullTime: { home: m.score?.fullTime?.home ?? null, away: m.score?.fullTime?.away ?? null } }
                };
            });

            // === FILTRO INTELIGENTE ===
            const matchesByLeague = {};
            translatedMatches.forEach(m => {
                const lId = m.league.name;
                if (!matchesByLeague[lId]) matchesByLeague[lId] = { finished: [], upcoming: [] };
                
                if (['FT', 'AET', 'PEN'].includes(m.fixture.status.short)) {
                    matchesByLeague[lId].finished.push(m);
                } else {
                    matchesByLeague[lId].upcoming.push(m);
                }
            });

            let finalFilteredMatches = [];
            for (const lId in matchesByLeague) {
                // Ordenamos los pasados
                const finished = matchesByLeague[lId].finished.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
                // Rescatamos los 10 más recientes aunque la liga haya acabado hace semanas
                const top10Finished = finished.slice(0, 10); 
                finalFilteredMatches = [...finalFilteredMatches, ...top10Finished, ...matchesByLeague[lId].upcoming];
            }

            finalFilteredMatches.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

            const finalPayload = { matches: finalFilteredMatches, forms: formsMap }; 
            
            if(finalFilteredMatches.length > 0){
                 localStorage.setItem(cacheKey, JSON.stringify(finalPayload));
            }
            
            return finalPayload;
        } catch(e) {
             console.error("🚨 Error al hacer fetch a Football-Data:", e);
             return { matches: [], forms: {} };
        }
    },

    async getH2HSummary(fixtureId, teamHomeId, teamAwayId) {
        try {
            const url = `${BASE_URL}/matches/${fixtureId}/head2head?limit=5`;
            const response = await fetch(url, { headers: HEADERS });
            if (!response.ok) throw new Error("No se pudo cargar el historial H2H");
            const data = await response.json();
            
            const agg = data.aggregates;
            if (!agg) return { homeWins: 0, draws: 0, awayWins: 0, total: 0 };
            return {
                homeWins: agg.homeTeam.wins, draws: agg.homeTeam.draws,
                awayWins: agg.awayTeam.wins, total: agg.numberOfMatches
            };
        } catch (e) {
            return { homeWins: 0, draws: 0, awayWins: 0, total: 0 };
        }
    }
};