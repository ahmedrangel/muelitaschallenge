class riotApi {
  constructor(RIOT_KEY) {
    this.RIOT_KEY = RIOT_KEY;
    this.domain = "api.riotgames.com";
  }

  route(region) {
    region = region.toLowerCase();
    switch (region) {
    case "lan":
      region = "la1";
      break;
    default:
      region = false;
      break;
    }
    return region;
  }

  cluster(region) {
    if (region == "lan") {
      return "americas";
    }
    return false;
  }

  async getSummonerByPuuid(puuid, route) {
    const response = await fetch(`https://${route}.${this.domain}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${this.RIOT_KEY}`);
    const data = await response.json();
    return data;
  }

  async getAccountByRiotID(name, tag, cluster) {
    const response = await fetch(`https://${cluster}.${this.domain}/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${this.RIOT_KEY}`);
    const data = await response.json();
    return data;
  }

  async getLiveGameBySummonerId(summoner_id, route) {
    const response = await fetch(`https://${route}.${this.domain}/lol/spectator/v4/active-games/by-summoner/${summoner_id}?api_key=${this.RIOT_KEY}`);
    const data = await response.json();
    return data;
  }

  async getRankedDataBySummonerId(summoner_id, route) {
    const response = await fetch(`https://${route}.${this.domain}/lol/league/v4/entries/by-summoner/${summoner_id}?api_key=${this.RIOT_KEY}`);
    const data = await response.json();
    return data;
  }

  async getMatchesByPuuid(puuid, cluster, count, queueId) {
    const response = await fetch(`https://${cluster}.${this.domain}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${this.RIOT_KEY}&queue=${queueId ? queueId : ""}`);
    const data = await response.json();
    return data;
  }
}

export const eloValues = {
  "IRON IV": 1,
  "IRON III": 2,
  "IRON II": 3,
  "IRON I": 4,
  "BRONZE IV": 5,
  "BRONZE III": 6,
  "BRONZE II": 7,
  "BRONZE I": 8,
  "SILVER IV": 9,
  "SILVER III": 10,
  "SILVER II": 11,
  "SILVER I": 12,
  "GOLD IV": 13,
  "GOLD III": 14,
  "GOLD II": 15,
  "GOLD I": 16,
  "PLATINUM IV": 17,
  "PLATINUM III": 18,
  "PLATINUM II": 19,
  "PLATINUM I": 20,
  "EMERALD IV": 21,
  "EMERALD III": 22,
  "EMERALD II": 23,
  "EMERALD I": 24,
  "DIAMOND IV": 25,
  "DIAMOND III": 26,
  "DIAMOND II": 27,
  "DIAMOND I": 28,
  "MASTER I": 29,
  "GRANDMASTER I": 30,
  "CHALLENGER I": 31
};

export default riotApi;