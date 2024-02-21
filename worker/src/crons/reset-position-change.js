export const resetPositionChange = async(env) => {
  await env.PARTICIPANTS.prepare("UPDATE participants SET position_change = ? WHERE position_change > ?")
    .bind(0, 0).run();

  return "Reset";
};