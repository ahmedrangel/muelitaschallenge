export const getPercentage = (wins: number, losses: number) => {
  const winrate = wins / (wins + losses) * 100;
  const formatted = winrate % 1 === 0 ? winrate.toFixed(0) : winrate.toFixed(1);
  return formatted;
};

export const table_head = [
  {
    id: "rank",
    name: "Rank",
    sortable: true
  },
  {
    name: "Cambio de posición",
    sortable: false
  },
  {
    id: "is_live",
    name: "En vivo",
    sortable: true
  },
  {
    id: "streamer",
    name: "Streamer",
    title: "Streamer",
    icon: "simple-icons:twitch",
    icon_class: "twitch",
    sortable: true
  },
  {
    name: "Twitter X",
    icon: "simple-icons:x",
    sortable: false
  },
  {
    id: "account",
    name: "Cuenta",
    title: "Cuenta",
    svg: "/images/opgg.svg",
    sortable: true
  },
  {
    id: "elo",
    name: "Elo",
    title: "Elo",
    sortable: true
  },
  {
    id: "matches",
    name: "Partidas",
    title: "Partidas",
    sortable: true
  },
  {
    id: "v_d",
    name: "V - D",
    title: "V - D",
    sortable: true
  },
  {
    id: "winrate",
    name: "Winrate",
    title: "Winrate",
    sortable: true
  }
];