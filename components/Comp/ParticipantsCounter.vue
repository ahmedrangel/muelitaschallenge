<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
  lastUpdated: { type: String, required: true }
});

const getServerTime = () => new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City", hour: "2-digit", hour12: false, minute: "2-digit", second: "2-digit" });
const serverTime = ref(getServerTime());
const interval = ref();
onMounted(() => {
  interval.value = setInterval(() => {
    serverTime.value = getServerTime();
  }, 1000);
});

onBeforeMount(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="mb-1">
    <div class="d-lg-flex d-block align-items-center justify-content-end gap-3">
      <div class="d-flex gap-1 align-items-center text-nowrap text-muted">
        <Icon name="ph:clock-bold" />
        <span>Hora server:
          <ClientOnly>{{ serverTime }}</ClientOnly>
        </span>
      </div>
    </div>
    <div class="d-lg-flex d-block align-items-center justify-content-between gap-3">
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
  </div>
</template>