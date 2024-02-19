<script setup lang="ts">
const { data: participants } = await useFetch("/api/participants") as Record<string, any>;
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
              <a v-if="p.twitter" target="_blank" :href="`https://x.com/${p.twitter}`" class="p-2 bg-black rounded d-inline-flex align-items-center small"><Icon name="simple-icons:x" /></a>
            </td>
            <td class="text-start">
              <div class="d-flex align-items-center gap-2">
                <img class="rounded-circle img-profile" :class="`${p.is_ingame ? 'ingame' : 'not-ingame'}`" :src="`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${p.lol_picture}.png`">
                <a target="_blank" class="small" :href="`https://op.gg/summoners/lan/${p.riot_name}-${p.riot_tag}`">{{ p.riot_name }} #{{ p.riot_tag }}</a>
              </div>
            </td>
            <td>
              <div v-if="p.elo">
                <small class="text-nowrap"><img :src="`/images/lol/${p.elo}.png`" height="36px"> {{ p.tier }}</small>
                <small class="d-block text-nowrap">{{ p.lp }} LP</small>
              </div>
              <div v-else>
                <small class="text-nowrap"><img :src="`/images/lol/unranked.png`" height="30px"></small>
              </div>
            </td>
            <td>
              <div class="d-flex gap-3 align-items-center justify-content-center">
                <small>{{ p.wins + p.losses }}</small>
                <div class="d-flex flex-column align-items-center">
                  <small>{{ p.wins }}<span class="text-muted"> V</span> <span class="text-muted">|</span> {{ p.losses }}<span class="text-muted"> D</span></small>
                  <div class="progress mt-2 rounded-1 " style="width: 70px; height: 10px;">
                    <div class="progress-bar bg-positive" role="progressbar" :style="{'width': (p.wins/(p.wins + p.losses) * 100) + '%' }" />
                    <div class="progress-bar bg-negative" role="progressbar" :style="{'width': (p.losses/(p.wins + p.losses) * 100) + '%' }" />
                  </div>
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
  </main>
</template>
