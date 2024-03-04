<template>
  <footer class="text-center py-4 border-top bg-footer text-muted">
    <h5 class="d-block mb-2">© {{ new Date().getFullYear() }} {{ SITE.name }}</h5>
    <h5 class="mb-2 small fw-light">
      Organizado por:
      <template v-for="(d, i) of SITE.organizers" :key="i">
        <a target="_blank" class="fw-bold" :href="`https://twitch.com/${d.user}`" :style="{'color': '#' + d.color + '!important;' }">
          {{ d.name }}
        </a>{{ i < SITE.organizers.length - 1 ? ' & ' : '' }}
      </template>
    </h5>
    <h6 class="mb-2 small fw-light">
      Desarrollado por:
      <template v-for="(d, i) of SITE.developers" :key="i">
        <a target="_blank" class="fw-bold" :href="`https://github.com/${d.github}`" :style="{'color': '#' + d.color + '!important;' }">
          {{ d.user }}
        </a>{{ i < SITE.developers.length - 1 ? ' & ' : '' }}
      </template>
    </h6>
    <h6 class="mb-0 small fw-light">
      Logo y banner por:
      <template v-for="(d, i) of SITE.designers" :key="i">
        <a target="_blank" class="fw-bold" :href="`https://twitch.com/${d.user}`" :style="{'color': '#' + d.color + '!important;' }">
          {{ d.name }}
        </a>{{ i < SITE.designers.length - 1 ? ' & ' : '' }}
      </template>
    </h6>
  </footer>
</template>