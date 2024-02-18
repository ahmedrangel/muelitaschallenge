<script setup lang="ts">
const participants = [
  {
    twitch_login: "ahmed_r",
    twitch_display: "Ahmed_R",
    twitch_picture: "jtv_user_pictures/9d70dd3e-e05f-4bf7-aaa6-2ad5df0875a5-profile_image-300x300.png",
    is_live: true,
    position_change: 10,
    position: 1,
    riotName: "Nombre",
    riotTag: "LAN",
    elo: "challenger",
    lp: 800,
    wins: 90,
    losses: 10,
    lol_picture: 588,
    is_ingame: true,
    tier: null,
    twitter: "AhmedRangel"
  },
  {
    twitch_login: "yizack",
    twitch_display: "Yizack",
    twitch_picture: "jtv_user_pictures/eda66302-4427-4a61-ba2f-4a843caa6b9a-profile_image-300x300.png",
    is_live: false,
    position_change: 0,
    position: 2,
    riotName: "Nombre",
    riotTag: "LAN",
    elo: "grandmaster",
    lp: 450,
    wins: 63,
    losses: 25,
    lol_picture: 1230,
    is_ingame: false,
    tier: null,
    twitter: "Yizack"
  },
  {
    twitch_login: "thewizardragon",
    twitch_display: "Thewizardragon",
    twitch_picture: "jtv_user_pictures/21ede6f3-6bdb-4968-872c-fcd7a99273d8-profile_image-300x300.png",
    is_live: false,
    position_change: -2,
    position: 3,
    riotName: "Nombre",
    riotTag: "LAN",
    elo: "platinum",
    lp: 0,
    wins: 16,
    losses: 15,
    lol_picture: 1430,
    is_ingame: false,
    tier: "II",
    twitter: null
  }
] as Array<Record<string, any>>;
</script>

<template>
  <!-- Pages: keep single root, everything goes inside 'main' -->
  <main>
    <!-- Cantidad de participantes -->
    <div class="d-flex gap-1 align-items-center mb-2">
      <Icon name="fa6-solid:user-group" />
      <span>{{ participants.length }} participantes</span>
    </div>
    <!-- Tabla de clasificación -->
    <div>
      <table class="table table-striped table-borderless rounded overflow-hidden">
        <thead>
          <tr style="height: 40px;" class="align-middle text-center">
            <th scope="col">#</th>
            <th scope="col" />
            <th scope="col" />
            <th scope="col">
              <div class="d-flex align-items-center px-1">
                <Icon class="twitch" name="simple-icons:twitch" />&nbsp;
                <small>Streamer</small>
              </div>
            </th>
            <th scope="col"><Icon class="small" name="simple-icons:x" /></th>
            <th scope="col">
              <div class="d-flex align-items-center px-1">
                <img src="/images/opgg.svg" width="23px">&nbsp;
                <small>Cuenta</small>
              </div>
            </th>
            <th scope="col"><small>Elo</small></th>
            <th scope="col"><small>Partidas</small></th>
            <th scope="col"><small>Winrate</small></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) of participants" :key="i" class="text-center align-middle">
            <th scope="row" style="width: 20px;"><small>{{ p.position }}</small></th>
            <th scope="row" style="width: 40px;">
              <div class="d-flex align-items-center justify-content-center gap-1" :class="`${p.position_change > 0 ? 'text-positive' : p.position_change < 0 ? 'text-negative' : 'text-muted'}`">
                <Icon :name="`${p.position_change > 0 ? 'solar:alt-arrow-up-bold' : p.position_change < 0 ? 'solar:alt-arrow-down-bold' : 'bi:dash-lg'}`" />
                <small v-if="Math.abs(p.position_change) > 0">{{ Math.abs(p.position_change) }}</small>
              </div>
            </th>
            <td scope="row" style="width: 20px;">
              <span :class="`${ p.is_live ? 'live' : 'not-live'}`">
                <Icon name="ph:circle-fill" />
              </span>
            </td>
            <td class="text-start">
              <div class="d-flex align-items-center gap-2">
                <img class="rounded-circle img-profile" :src="`https://static-cdn.jtvnw.net/${p.twitch_picture}`">
                <a target="_blank" class="small" :href="`https://twitch.tv/${p.twitch_login}`">{{ p.twitch_display }}</a>
              </div>
            </td>
            <td scope="row" style="width: 20px;">
              <a v-if="p.twitter" target="_blank" :href="`https://x.com/${p.twitter}`" class="p-2 bg-black rounded d-inline-flex align-items-center small"><Icon name="simple-icons:x" /></a>
            </td>
            <td class="text-start">
              <div class="d-flex align-items-center gap-2">
                <img class="rounded-circle img-profile" :class="`${p.is_ingame ? 'ingame' : 'not-ingame'}`" :src="`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${p.lol_picture}.png`">
                <a target="_blank" class="small" :href="`https://op.gg/summoners/lan/${p.riotName}-${p.riotTag}`">{{ p.riotName }} #{{ p.riotTag }}</a>
              </div>
            </td>
            <td>
              <small class="text-nowrap"><img :src="`/images/lol/${p.elo}.png`" height="36px"> {{ p.tier }}</small>
              <small class="d-block text-nowrap">{{ p.lp }} LP</small>
            </td>
            <td>
              <div class="d-flex gap-3 align-items-center justify-content-center">
                <small>{{ p.wins + p.losses }}</small>
                <div>
                  <small>{{ p.wins }}<span class="text-muted"> V</span> <span class="text-muted">|</span> {{ p.losses }}<span class="text-muted"> D</span></small>
                  <div class="progress mt-2 rounded-1" style="width: 70px; height: 10px;">
                    <div class="progress-bar bg-positive" role="progressbar" :style="{'width': (p.wins/(p.wins + p.losses) * 100) + '%' }" />
                    <div class="progress-bar bg-negative" role="progressbar" :style="{'width': (p.losses/(p.wins + p.losses) * 100) + '%' }" />
                  </div>
                </div>
              </div>
            </td>
            <td>
              <small>{{ getPercentage(p.wins, p.losses) }}%</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
