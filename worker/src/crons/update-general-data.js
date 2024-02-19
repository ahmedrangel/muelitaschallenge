import twitchApi from "../apis/twitchApi";
import riotApi, { eloValues } from "../apis/riotApi";
import { fixRank } from "../utils/helpers";

const region = "lan";

export const updateGeneralData = async(env) => {
  const { results } = await env.PARTICIPANTS.prepare("SELECT id_summoner, twitch_login, position, position_change from participants").all();
  if (!results[0]) return null;
  const _riot = new riotApi(env.RIOT_KEY);
  const _twitch = new twitchApi(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
  const route = _riot.route(region);
  const participants = [];
  const logins = [];

  // Update ranked data
  for (const p of results) {
    const ranked_data = await _riot.getRankedDataBySummonerId(p.id_summoner, route);
    const soloq = ranked_data.filter(item => item.queueType === "RANKED_SOLO_5x5")[0];
    logins.push(p.twitch_login);

    if (soloq) {
      participants.push({ id_summoner: p.id_summoner, wins: soloq.wins, losses: soloq.losses, lp: soloq.leaguePoints, elo: soloq.tier, tier: soloq.rank, position: p.position, position_change: p.position_change });
      await env.PARTICIPANTS.prepare("UPDATE participants SET wins = ?, losses = ?, lp = ?, elo = ?, tier = ? WHERE id_summoner = ?")
        .bind(soloq.wins, soloq.losses, soloq.leaguePoints, soloq.tier.toLowerCase(), fixRank(soloq.tier, soloq.rank), p.id_summoner).run();
    }
  }

  // Sort participants by elo and lp
  const sorted = participants.sort((a, b) => {
    const eloComparison = eloValues[`${b.elo} ${b.tier}`] - eloValues[`${a.elo} ${a.tier}`];
    if (eloComparison !== 0) {
      return eloComparison;
    }
    return b.lp - a.lp;
  });

  // Update participants position and position_change
  let index = 0;
  for (const p of sorted) {
    const next_position = index + 1;
    const position_change = (p.position - next_position) + p.position_change;
    await env.PARTICIPANTS.prepare("UPDATE participants SET position = ?, position_change = ? WHERE id_summoner = ?")
      .bind(next_position, position_change, p.id_summoner).run();
    index++;
  }

  // Update participants live status
  const streams_data = await _twitch.getStreamsByName(logins);
  await env.PARTICIPANTS.prepare("UPDATE participants SET is_live = 0 WHERE is_live = 1").run();
  for (const s of streams_data) {
    await env.PARTICIPANTS.prepare("UPDATE participants SET is_live = ? WHERE twitch_login = ?")
      .bind(1, s.user_login).run();
  }

  return sorted;
};