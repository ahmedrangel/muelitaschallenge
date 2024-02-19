<script setup lang="ts">
const { data: participants } = await useFetch("/api/participants") as Record<string, any>;
</script>

<template>
  <!-- Pages: keep single root, everything goes inside 'main' -->
  <main>
    <!-- Cantidad de participantes -->
    <CompParticipantsCounter :data="participants" />
    <!-- Tabla de clasificación -->
    <CompRanking :data="participants" />
  </main>
</template>
