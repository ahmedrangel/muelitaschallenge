export default defineEventHandler(async () => {
  const DB = process.env.PARTICIPANTS as any;
  const { results } = await DB.prepare("SELECT riot_name, riot_tag, lol_picture, twitch_login, twitch_display, twitch_picture, twitter, is_live, is_ingame, wins, losses, lp, elo, tier, position, position_change from participants").all();
  return results.sort((a: Record<string, number>, b: Record<string, number>) => {
    if (!a.position || !b.position) {
      if (!a.position) return 1;
      if (!b.position) return -1;
    }
    return a.position - b.position;
  });
});
