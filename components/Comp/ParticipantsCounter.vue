<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
  lastUpdated: { type: String, required: true }
});
</script>

<template>
  <div class="d-lg-flex d-block align-items-center justify-content-between mb-2 gap-3">
    <div class="d-flex gap-1 align-items-center text-nowrap">
      <Icon name="fa6-solid:user-group" />
      <span>{{ props.data ? props.data.length : 0 }} participantes</span>
    </div>
    <div v-if="props.lastUpdated" class="d-flex gap-1 align-items-center text-nowrap">
      <Icon name="ph:clock-clockwise-bold" />
      <span>Actualizado:</span>
      <span>hace {{ getTimeUnitsFromISODate(props.lastUpdated) }}</span>
    </div>
  </div>
</template>