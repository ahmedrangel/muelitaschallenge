import twitchApi from "../apis/twitchApi";
import riotApi, { eloValues } from "../apis/riotApi";
import { fixRank } from "../utils/helpers";

const region = "lan";
const participants = [];

// Iterated fetch
const updateRankedData = async(env, p) => {
  const _riot = new riotApi(env.RIOT_KEY);
  const route = _riot.route(region);
  const ranked_data = await _riot.getRankedDataBySummonerId(p.id_summoner, route);
  const soloq = ranked_data.filter(item => item.queueType === "RANKED_SOLO_5x5")[0];

  if (soloq) {
    participants.push({ id_summoner: p.id_summoner, wins: soloq.wins, losses: soloq.losses, lp: soloq.leaguePoints, elo: soloq.tier, tier: soloq.rank, position: p.position, position_change: p.position_change });
    await env.PARTICIPANTS.prepare("UPDATE participants SET wins = ?, losses = ?, lp = ?, elo = ?, tier = ? WHERE id_summoner = ?")
      .bind(soloq.wins, soloq.losses, soloq.leaguePoints, soloq.tier.toLowerCase(), fixRank(soloq.tier, soloq.rank), p.id_summoner).run();
  }

  return participants;
};

const sortRankedData = async(env) => {
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

  return sorted;
};

// Single fetch
const updateTwitchLiveStatus = async(env, twitch_ids) => {
  const _twitch = new twitchApi(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
  // Update participants live status
  const streams_data = await _twitch.getStreamsById(twitch_ids);
  await env.PARTICIPANTS.prepare("UPDATE participants SET is_live = 0 WHERE is_live = 1").run();
  for (const s of streams_data) {
    await env.PARTICIPANTS.prepare("UPDATE participants SET is_live = ? WHERE twitch_id = ?")
      .bind(1, s.user_id).run();
  }
};

// Single fetch
const updateTwitchData = async(env, twitch_ids) => {
  const _twitch = new twitchApi(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
  const data = [];
  const users_data = await _twitch.getUsersById(twitch_ids);
  for (const u of users_data) {
    data.push(u);
    await env.PARTICIPANTS.prepare("UPDATE participants SET twitch_login = ?, twitch_display = ?, twitch_picture = ? WHERE twitch_id = ?")
      .bind(u.login, u.display_name, u.profile_image_url.replace("https://static-cdn.jtvnw.net/",""), u.id).run();
  }
  return data;
};

// Export
export const updateGeneralData = async(env) => {
  const { results } = await env.PARTICIPANTS.prepare("SELECT id_summoner, twitch_id, position, position_change from participants").all();
  if (!results[0]) return null;

  const twitch_ids = [];

  // Update ranked data
  for (const p of results) {
    twitch_ids.push(p.twitch_id);
    await updateRankedData(env, p);
  }

  const sorted = await sortRankedData(env);
  await updateTwitchLiveStatus(env, twitch_ids);
  await updateTwitchData(env, twitch_ids);

  await env.PARTICIPANTS.prepare("UPDATE control SET last_updated = ? WHERE id = ?")
    .bind(new Date().toISOString(), 1).run();

  return sorted;
};

/*
 * Requests amount:
 * Update Ranked Data (# DB length) + Update Twitch Live Status (1) + UpdateTwitchData (1)
 */