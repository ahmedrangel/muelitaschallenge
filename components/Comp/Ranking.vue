<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
});

const participants = ref(props.data);

const sort = (type: string, order: string) => {
  const sorters: Record<string, (a: any, b: any) => number> = {
    rank: (a, b) => order === "desc" ? b.position - a.position : a.position - b.position,
    is_live: (a, b) => order === "desc" ? b.is_live - a.is_live : a.is_live - b.is_live,
    streamer: (a, b) => order === "desc" ? b.twitch_login.localeCompare(a.twitch_login) : a.twitch_login.localeCompare(b.twitch_login),
    account: (a, b) => order === "desc" ? b.riot_name.localeCompare(a.riot_name) : a.riot_name.localeCompare(b.riot_name),
    elo: (a, b) => order === "desc" ? a.position - b.position : b.position - a.position,
    matches: (a, b) => order === "desc" ? (b.wins + b.losses) - (a.wins + a.losses) : (a.wins + a.losses) - (b.wins + b.losses),
    v_d: (a, b) => order === "desc" ? b.wins - a.wins : a.wins - b.wins,
    winrate: (a, b) => order === "desc" ? (b.wins / (b.wins + b.losses) * 100) - (a.wins / (a.wins + a.losses) * 100) : (a.wins / (a.wins + a.losses) * 100) - (b.wins / (b.wins + b.losses) * 100),
  };

  if (!type && order === "init") {
    participants.value.sort((a: Record<string, number>, b: Record<string, number>) => {
      return a.position - b.position;
    });
  }
  else if (sorters[type]) {
    participants.value.sort(sorters[type]);
  }
};

const removeSort = (currentId: string) => {
  document.querySelectorAll(".desc").forEach(el => {
    if (el.id !== currentId) el.classList.remove("desc");
  });
  document.querySelectorAll(".asc").forEach(el => {
    if (el.id !== currentId) el.classList.remove("asc");
  });
};

const toggleClass = (head: HTMLElement) => {
  if (!head.classList.contains("desc") && !head.classList.contains("asc")) {
    head.classList.add("desc");
  }
  else if (head.classList.contains("desc")) {
    head.classList.remove("desc");
    head.classList.add("asc");
  }
  else if (head.classList.contains("asc")) {
    head.classList.remove("asc");
  }
};

const clickHandler = (head: HTMLElement) => {
  removeSort(head.id);
  toggleClass(head);
  head.classList.contains("desc") ? sort(head.id, "desc") : head.classList.contains("asc") ? sort(head.id, "asc") : sort("", "init");
};

const sorterHandler = (type: string) => {
  for (const el of table_head) {
    const head = document.querySelector("#" + el.id) as HTMLElement;
    if (head) {
      if (type === "add") {
        head.addEventListener("click", () => { clickHandler(head); });
      }
      else {
        head.removeEventListener("click", () => { clickHandler(head); });
      }
    }
  }
};

onMounted(() => {
  sorterHandler("add");
});

onBeforeUnmount(() => {
  sorterHandler("remove");
});
</script>

<template>
  <div>
    <table class="table table-striped table-borderless rounded overflow-hidden">
      <thead>
        <tr style="height: 40px;" class="align-middle text-center">
          <template v-for="(h, i) of table_head" :key="i">
            <th :id="h.id" scope="col" :class="`${h.sortable ? 'sortable' : ''}`" class="user-select-none border" :title="h.name">
              <div v-if="h.sortable" class="d-flex align-items-center justify-content-evenly">
                <div v-if="h.title" class="d-flex align-items-center">
                  <Icon v-if="h.icon" :class="`${h.icon_class ? h.icon_class : ''}`" :name="`${h.icon ? h.icon : ''}`" />
                  <img v-if="h.svg" :src="h.svg" width="23px">
                    &nbsp;
                  <small>{{ h.title }}</small>
                </div>
                <span class="arrows" />
              </div>
              <div v-else>
                <span v-if="h.icon">
                  <Icon :name="h.icon" />
                </span>
              </div>
            </th>
          </template>
        </tr>
      </thead>
      <tbody class="border">
        <tr v-for="p of participants" :key="p.position" class="text-center align-middle">
          <th scope="row" style="width: 20px;"><small>{{ p.position }}</small></th>
          <th scope="row" style="width: 40px;">
            <div class="d-flex align-items-center justify-content-center gap-1" :class="`${p.position_change > 0 ? 'text-positive' : p.position_change < 0 ? 'text-negative' : 'text-muted'}`">
              <Icon :name="`${p.position_change > 0 ? 'solar:alt-arrow-up-bold' : p.position_change < 0 ? 'solar:alt-arrow-down-bold' : 'bi:dash-lg'}`" />
              <small v-if="Math.abs(p.position_change) > 0">{{ Math.abs(p.position_change) }}</small>
            </div>
          </th>
          <td scope="row" style="width: 20px;">
            <span class="d-flex align-items-center" :class="`${ p.is_live ? 'live' : 'not-live'}`">
              <Icon name="ph:circle-fill" />
            </span>
          </td>
          <td class="text-start">
            <div class="d-flex align-items-center gap-2">
              <img class="rounded-circle img-profile" :src="`https://static-cdn.jtvnw.net/${p.twitch_picture}`">
              <a target="_blank" class="small" :href="`https://twitch.tv/${p.twitch_login}`">{{ p.twitch_display }}</a>
            </div>
          </td>
          <td>
            <a v-if="p.instagram" target="_blank" :href="`https://instagram.com/${p.instagram}`" class="p-2 bg-instagram rounded d-inline-flex align-items-center small text-white"><Icon name="simple-icons:instagram" /></a>
          </td>
          <td>
            <a v-if="p.twitter" target="_blank" :href="`https://x.com/${p.twitter}`" class="p-2 bg-black rounded d-inline-flex align-items-center small text-white"><Icon name="simple-icons:x" /></a>
          </td>
          <td class="text-start">
            <div class="d-flex align-items-center gap-2">
              <img class="rounded-circle img-profile" :class="`${p.is_ingame ? 'ingame' : 'not-ingame'}`" :src="`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${p.lol_picture}.png`">
              <a target="_blank" class="small text-nowrap" :href="`https://op.gg/summoners/lan/${p.riot_name}-${p.riot_tag}`">{{ p.riot_name }} #{{ p.riot_tag }}</a>
            </div>
          </td>
          <td>
            <div v-if="p.elo" class="py-1">
              <small class="text-nowrap"><img :src="`/images/lol/${p.elo}.png`" height="36px"> {{ p.tier }}</small>
              <small class="d-block text-nowrap">{{ p.lp }} LP</small>
            </div>
            <div v-else>
              <small class="text-nowrap"><img :src="`/images/lol/unranked.png`" height="30px"></small>
            </div>
          </td>
          <td>
            <small>{{ p.wins + p.losses }}</small>
          </td>
          <td>
            <div class="d-flex flex-column align-items-center">
              <small class="text-nowrap">{{ p.wins }}<span class="text-muted"> V</span> <span class="text-muted">|</span> {{ p.losses }}<span class="text-muted"> D</span></small>
              <div class="progress mt-2 rounded-1 " style="width: 70px; height: 10px;">
                <div class="progress-bar bg-positive" role="progressbar" :style="{'width': (p.wins/(p.wins + p.losses) * 100) + '%' }" />
                <div class="progress-bar bg-negative" role="progressbar" :style="{'width': (p.losses/(p.wins + p.losses) * 100) + '%' }" />
              </div>
            </div>
          </td>
          <td>
            <small v-if="p.wins && p.losses">{{ getPercentage(p.wins, p.losses) }}%</small>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>