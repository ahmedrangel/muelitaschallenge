import example from "../../content/participants-example.json";

export default defineEventHandler(async () => {
  if (process.dev) return example;

  const DB = process.env.PARTICIPANTS as any;
  const { results } = await DB.prepare("SELECT riot_name, riot_tag, lol_picture, twitch_login, twitch_display, twitch_picture, twitter, is_live, is_ingame, wins, losses, lp, elo, tier, position, position_change, instagram from participants").all();

  if (!results[0]) return null;

  const control = await DB.prepare("SELECT last_updated FROM control WHERE id = ?").bind(1).first();

  const sorted = results.sort((a: Record<string, number>, b: Record<string, number>) => {
    if (!a.position || !b.position) {
      if (!a.position) return 1; // Colocar a 'a' al final
      if (!b.position) return -1; // Colocar a 'b' al final
    }
    return a.position - b.position;
  });

  const banned = ["angar"] as string[];
  let i = 0;
  for (const participant of sorted) {
    participant.raw_position = ++i;
    if (banned.includes(participant.twitch_login)) participant.is_banned = 1;
    else participant.is_banned = 0;
  }

  const data = { participants: sorted, last_updated: control.last_updated };
  return data;
});
