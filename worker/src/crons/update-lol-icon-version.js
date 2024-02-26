import { ofetch } from "ofetch";

export const updateLolIconVersion = async(env) => {
  const versions = await ofetch("https://ddragon.leagueoflegends.com/realms/lan.json").catch(() => null);
  if (!versions) return null;
  await env.PARTICIPANTS.prepare("UPDATE control SET lol_icon_version = ? WHERE id = ?").bind(versions?.n?.profileicon, 1).run();
  return { lol_icon_version: versions?.n?.profileicon };
};

/*
 * Requests amount:
 * Update Lol Icon Version (1)
 */