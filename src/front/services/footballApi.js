export const getMatchesByLeague = async (leagueId, from, to) => {
  const res = await fetch(
    `/api/fixtures?league=${leagueId}&from=${from}&to=${to}`
  );

  const data = await res.json();

  console.log("🔥 API RESPONSE:", data);

  return data;
};