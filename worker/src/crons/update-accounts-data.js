import riotApi from "../apis/riotApi";

const region = "lan";

// Iterated fetch
const updateLolIcon = async(env, puuid) => {
  const _riot = new riotApi(env.RIOT_KEY);
  const route = _riot.route(region);
  const summoner_data = await _riot.getSummonerByPuuid(puuid, route);
  await env.PARTICIPANTS.prepare("UPDATE participants SET lol_picture = ? WHERE puuid = ?")
    .bind(summoner_data.profileIconId, puuid).run();
};


// Export
export const updateAccountsData = async(env) => {
  const { results } = await env.PARTICIPANTS.prepare("SELECT puuid from participants").all();
  if (!results[0]) return null;

  // Update data
  for (const p of results) {
    await updateLolIcon(env, p.puuid);
  }
};

/*
 * Requests amount:
 * Update Lol Icon (# DB length)
 */