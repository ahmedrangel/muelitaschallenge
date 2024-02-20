<script setup lang="ts">
const { data: data } = await useFetch("/api/participants") as Record<string, any>;
const { participants, last_updated } = data.value;
</script>

<template>
  <!-- Pages: keep single root, everything goes inside 'main' -->
  <main>
    <!-- Cantidad de participantes -->
    <CompParticipantsCounter :data="participants" :last-updated="last_updated" />
    <!-- Tabla de clasificación -->
    <CompRanking v-if="participants" :data="participants" />
  </main>
</template>
