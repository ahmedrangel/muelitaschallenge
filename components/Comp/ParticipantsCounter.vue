<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
  lastUpdated: { type: String, required: true }
});

const getServerTime = () => new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City", hour: "2-digit", hour12: false, minute: "2-digit", second: "2-digit" });
const serverTime = ref(getServerTime());
const last_updated_time = ref(getTimeUnitsFromISODate(props.lastUpdated));
const outdated_message = ref(false);

const interval = ref();
const interval2 = ref();

const isOutdated = () => {
  const { $Tooltip } = useNuxtApp();
  const element = document.querySelector("[data-bs-toggle=\"tooltip-last-updated\"]") as HTMLElement;
  const instance = $Tooltip.getInstance(element);
  instance?.show();
  outdated_message.value = true;
};

onMounted(() => {
  let i = 0;
  interval.value = setInterval(() => {
    serverTime.value = getServerTime();
    last_updated_time.value = getTimeUnitsFromISODate(props.lastUpdated);
  }, 1000);

  interval2.value = setInterval(async() => {
    if (last_updated_time.value.outdated) {
      const { last_updated } = await $fetch("/api/participants").catch(() => null) as Record<string,any>;
      if (last_updated !== props.lastUpdated) {
        isOutdated();
        clearInterval(interval2.value);
      }
      if (i === 9) clearInterval(interval2.value);
      i++;
    }
  }, 30000);
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
  clearInterval(interval2.value);
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
        <span :class="`${outdated_message ? 'text-negative text-decoration-underline available-update' : ''}`" data-bs-toggle="tooltip-last-updated" title="<span class='text-dark fw-bold'>¡Resultados actualizados!</span><br><span>Refresca la página para ver los últimos resultados.</span>">hace {{ last_updated_time.result }}</span>
      </div>
    </div>
  </div>
</template>