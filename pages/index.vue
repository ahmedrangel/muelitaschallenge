<script setup lang="ts">
const { data: data } = await useFetch("/api/participants") as Record<string, any>;
const participants = data.value?.participants;
const last_updated = data.value?.last_updated;
</script>

<template>
  <!-- Pages: keep single root, everything goes inside 'main' -->
  <main>
    <div class="text-center">
      <img src="/images/muelitaschallenge_wm.png" class="img-fluid" width="600">
    </div>
    <!-- Cantidad de participantes -->
    <CompParticipantsCounter :data="participants" :last-updated="last_updated" />
    <!-- Tabla de clasificación -->
    <CompRanking v-if="participants" :data="participants" />
    <div class="justify-content-start align-items-center d-flex gap-1 small mt-1">
      <Icon name="ph:info-bold" />
      <span>Los cambios de posición y partidas restantes se restauran a las 00:00 <NuxtLink to="/">hora server</NuxtLink> (GMT-6).</span>
    </div>
  </main>
</template>
