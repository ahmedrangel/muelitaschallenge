import { Router } from "itty-router";
import JsResponse from "./response";
import JsonResponse from "./jsonResponse";
import riotApi from "./apis/riotApi";
import twitchApi from "./apis/twitchApi";

const router = Router();

router.post("/add", async (req, env) => {
  const region = "lan";
  const _twitch = new twitchApi(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
  const _riot = new riotApi(env.RIOT_KEY);
  const route = _riot.route(region);
  const cluster = _riot.cluster(region);
  try {
    const { riot_name, riot_tag, key, twitch, twitter } = await req.json();
    if (key === env.POST_KEY) {
      if (!riot_name || !riot_tag || !twitch) return new JsonResponse({ status: "Bad Request", status_code: 400 });
      // League of legends
      const { puuid } = await _riot.getAccountByRiotID(riot_name, riot_tag, cluster);
      const summoner = await _riot.getSummonerByPuuid(puuid, route);
      const lol_picture = summoner.profileIconId;
      const id_summoner = summoner.id;
      // Twitch
      const twitch_data = await _twitch.getUserByName(twitch);
      const twitch_login = twitch_data.login;
      const twitch_display = twitch_data.display_name;
      const twitch_picture = twitch_data.profile_image_url.replace("https://static-cdn.jtvnw.net/","");
      // Add DB
      await env.PARTICIPANTS.prepare(
        `
        INSERT OR IGNORE INTO participants (puuid, id_summoner, riot_name, riot_tag, lol_picture, twitch_login, twitch_display, twitch_picture, twitter)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      ).bind(puuid, id_summoner, riot_name, riot_tag, lol_picture, twitch_login, twitch_display, twitch_picture, twitter ? twitter : "").run();
      return new JsonResponse({ puuid, id_summoner, riot_name, riot_tag, lol_picture, twitch_login, twitch_display, twitch_picture, twitter: twitter ? twitter : ""});
    }
    return new JsonResponse({ status: "Forbidden", status_code: 403 });
  }
  catch (err) {
    return new JsonResponse({ status: "Bad Request", status_code: 400 });
  }
});

router.get("/participants", async (req, env) => {
  const { results } = await env.PARTICIPANTS.prepare("SELECT riot_name, riot_tag, lol_picture, twitch_login, twitch_display, twitch_picture, twitter, is_live, is_ingame, wins, losses, lp, elo, tier, position, position_change from participants").all();
  return new JsonResponse(results);
});

router.all("*", () => new JsResponse("Not Found.", { status: 404 }));

export default {
  async fetch(req, env, ctx) {
    return router.handle(req, env, ctx);
  },
  async scheduled(event, env, ctx) {
    switch (event.cron) {
    case "*/5 * * * *":
      //
      break;
    }
  }
};

