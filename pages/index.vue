<script setup lang="ts">
const { data: data } = await useFetch("/api/participants") as Record<string, any>;
const participants = data.value?.participants;
const last_updated = data.value?.last_updated;

useSeoMeta({
  title: SITE.title,
  description: SITE.description,
  keywords: SITE.keywords,
  // Open Graph
  ogType: "website",
  ogTitle: SITE.title,
  ogSiteName: SITE.name,
  ogDescription: SITE.description,
  ogUrl: SITE.host,
  ogImage: SITE.host + "/" + SITE.banner,
  // Twitter
  twitterCard: "summary_large_image",
  twitterTitle: SITE.title,
  twitterDescription: SITE.description
});

useHead({
  link: [
    { rel: "canonical", href: SITE.host }
  ]
});
</script>

<template>
  <!-- Pages: keep single root, everything goes inside 'main' -->
  <main>
    <div class="text-center my-3">
      <img :src="`/${SITE.banner}`" class="img-fluid mb-4" width="600">
      <h5 class="text-uppercase mb-0 fw-bold">Tabla del {{ SITE.name }} 2024</h5>
      <small class="fw-bold">1 Marzo — 31 Marzo</small>
    </div>
    <!-- Cantidad de participantes -->
    <CompParticipantsCounter :data="participants" :last-updated="last_updated" />
    <!-- Tabla de clasificación -->
    <CompRanking v-if="participants" :data="participants" />
    <div class="justify-content-start align-items-center d-flex gap-2 small mt-1">
      <Icon name="ph:info-bold" class="h4 mb-0" />
      <div>
        <span>La tabla se actualiza <b>cada 5 minutos</b>. Asegúrate de refrescar la página para ver los últimos resultados</span>
        <br>
        <span>Los cambios de posición y partidas restantes se restauran a las 00:00 <NuxtLink to="/">hora server</NuxtLink> (GMT-6).</span>
      </div>
    </div>
    <hr class="mt-5 mb-4">
    <CompChart />
  </main>
</template>
