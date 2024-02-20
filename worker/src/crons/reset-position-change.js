export const resetPositionChange = async(env) => {
  const { results } = await env.PARTICIPANTS.prepare("SELECT id_summoner, position_change from participants").all();
  for (const r of results) {
    await env.PARTICIPANTS.prepare("UPDATE participants SET position_change = 0 WHERE id_summoner = ?").bind(r.id_summoner).run();
  }

  return results;
};