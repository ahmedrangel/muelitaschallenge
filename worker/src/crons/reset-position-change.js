import { ofetch } from "ofetch";

export const updateLolIconVersion = async(env) => {
  const versions = await ofetch("https://ddragon.leagueoflegends.com/realms/lan.json").catch(() => null);
  if (!versions) return null;
  await env.PARTICIPANTS.prepare("UPDATE control SET lol_icon_version = ? WHERE id = ?").bind(versions?.n?.profileicon, 1).run();
  return { lol_icon_version: versions?.n?.profileicon };
};

export const resetPositionChange = async(env) => {
  await env.PARTICIPANTS.prepare("UPDATE participants SET position_change = 0 WHERE position_change IS NOT 0").run();
  // Update Lol Icon Version
  await updateLolIconVersion(env);

  return "Reset";
};

/*
 * Requests amount:
 * Update Lol Icon Version (1)
 */