import twitchApi from "../apis/twitchApi";
import riotApi, { eloValues } from "../apis/riotApi";
import { fixRank, resetPositionChange } from "../utils/helpers";

const region = "lan";
let participants = [];
let twitch_data = [];
let updater_participants = [];
let updater_ingame = [];
let updater_position_change = [];

// Iterated fetch
const updateRankedData = async(env, p) => {
  const _riot = new riotApi(env.RIOT_KEY);
  const route = _riot.route(region);
  const ranked_data = await _riot.getRankedDataBySummonerId(p.id_summoner, route);
  if (ranked_data[0]) {
    const soloq = ranked_data.filter(item => item.queueType === "RANKED_SOLO_5x5")[0];

    if (soloq) {
      participants.push({ puuid: p.puuid, id_summoner: p.id_summoner, wins: soloq.wins, losses: soloq.losses, lp: soloq.leaguePoints, elo: soloq.tier, tier: soloq.rank, position: p.position, position_change: p.position_change });
      if (p.wins !== soloq.wins || p.losses !== soloq.losses || p.lp !== soloq.leaguePoints) {
        updater_participants.push({ puuid: p.puuid, wins: soloq.wins, losses: soloq.losses, lp: soloq.leaguePoints, elo: soloq.tier.toLowerCase(), tier: fixRank(soloq.tier, soloq.rank) });
      }
    }

    return participants;
  }
};

// Iterated fetch
const updateLolIngameStatus = async(env, p) => {
  const _riot = new riotApi(env.RIOT_KEY);
  const route = _riot.route(region);
  const ingame_data = await _riot.getSpectatorByPuuid(p.puuid, route);

  if (ingame_data?.participants) {
    if (p.is_ingame !== 1)
      updater_ingame.push({ puuid: p.puuid, is_ingame: 1 });
  }
  else {
    if (p.is_ingame !== 0)
      updater_ingame.push({ puuid: p.puuid, is_ingame: 0 });
  }
};

const sortRankedData = () => {
  if (!participants[0]) return null;

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
    if (p.position !== next_position || p.position_change !== position_change) {
      updater_position_change.push({ puuid: p.puuid, position: next_position, position_change });
    }
    index++;
  }

  return sorted;
};

// Single fetch
const updateTwitchLiveStatus = async(env, twitch_ids) => {
  const _twitch = new twitchApi(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
  // Update participants live status
  const streams_data = await _twitch.getStreamsById(twitch_ids);
  const live_ids = streams_data.map(s => s.user_id);
  for (const p of twitch_data) {
    if (live_ids.includes(p.twitch_id)) {
      if (p.is_live !== 1)
        await env.PARTICIPANTS.prepare("UPDATE participants SET is_live = ? WHERE twitch_id = ?")
          .bind(1, p.twitch_id).run();
    }
    else {
      if (p.is_live !== 0)
        await env.PARTICIPANTS.prepare("UPDATE participants SET is_live = ? WHERE twitch_id = ?")
          .bind(0, p.twitch_id).run();
    }
  }
};

// Single fetch
const updateTwitchData = async(env, twitch_ids) => {
  const _twitch = new twitchApi(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
  const data = [];
  const users_data = await _twitch.getUsersById(twitch_ids);
  for (const u of users_data) {
    data.push(u);
    const match_participant = twitch_data.filter(p => p.twitch_id == u.id)[0];
    if (u.login !== match_participant.twitch_login || u.display_name !== match_participant.twitch_display || u.profile_image_url.replace("https://static-cdn.jtvnw.net/","") !== match_participant.twitch_picture) {
      await env.PARTICIPANTS.prepare("UPDATE participants SET twitch_login = ?, twitch_display = ?, twitch_picture = ? WHERE twitch_id = ?")
        .bind(u.login, u.display_name, u.profile_image_url.replace("https://static-cdn.jtvnw.net/",""), u.id).run();
    }
  }
  return data;
};

// Export
export const updateGeneralData = async(env) => {
  const { results } = await env.PARTICIPANTS.prepare("SELECT puuid, id_summoner, twitch_id, position, position_change, wins, losses, lp, is_ingame, twitch_login, twitch_display, twitch_picture, is_live from participants").all();
  if (!results[0]) return null;

  participants = [];
  twitch_data = [];
  updater_participants = [];
  updater_ingame = [];
  updater_position_change = [];
  const twitch_ids = [];

  let index = 0;
  // Update ranked data
  for (const p of results) {
    if (index === 9) {
      await new Promise(resolve => setTimeout(resolve, 1100));
      index = 0;
    }
    twitch_ids.push(p.twitch_id);
    await updateRankedData(env, p);
    await new Promise(resolve => setTimeout(resolve, 50));
    await updateLolIngameStatus(env, p);
    await new Promise(resolve => setTimeout(resolve, 100));
    twitch_data.push({ twitch_id: p.twitch_id, twitch_login: p.twitch_login, twitch_display: p.twitch_display, twitch_picture: p.twitch_picture, is_live: p.is_live });
    index++;
  }

  const sorted = sortRankedData();

  await updateTwitchData(env, twitch_ids);
  await updateTwitchLiveStatus(env, twitch_ids);

  console.info(updater_participants);
  console.info(updater_position_change);
  console.info(updater_ingame);

  // Ranked update
  for (const p of updater_participants) {
    await env.PARTICIPANTS.prepare("UPDATE participants SET wins = ?, losses = ?, lp = ?, elo = ?, tier = ? WHERE puuid = ?")
      .bind(p.wins, p.losses, p.lp, p.elo, p.tier, p.puuid).run();
  }

  // Position change update
  for (const p of updater_position_change) {
    await env.PARTICIPANTS.prepare("UPDATE participants SET position = ?, position_change = ? WHERE puuid = ?")
      .bind(p.position, p.position_change, p.puuid).run();
  }

  // Ingame update
  for (const p of updater_ingame) {
    await env.PARTICIPANTS.prepare("UPDATE participants SET is_ingame = ? WHERE puuid = ?")
      .bind(p.is_ingame, p.puuid).run();
  }

  // Reset position_change if hour is 0 and minutes < 10
  await resetPositionChange(env);

  // Update last_updated
  await env.PARTICIPANTS.prepare("UPDATE control SET last_updated = ? WHERE id = ?")
    .bind(new Date().toISOString(), 1).run();

  return { sorted };
};

/*
 * Requests amount:
 * Update Ranked Data (# DB length) + Update Twitch Live Status (1) + UpdateTwitchData (1)
 */