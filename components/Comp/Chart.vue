<script setup lang="ts">
import Chart from "primevue/chart";
import history from "../content/participants-history.json";

const props = defineProps({
  data: { type: Object, required: true },
});

const selected = ref("") as Ref<string>;

const full_array = ref([]) as Ref<string[]>;
const array_order = [] as string[];

const selected_array = ref([]) as Ref<string[]>;

const datasets = ref([]) as Ref<Record<string, any>[]>;

for (const p of props.data as Record<string, any>[]) {
  full_array.value.push(p.twitch_display);
  array_order.push(p.twitch_display);
  selected_array.value?.push(p.twitch_display);
  full_array.value = full_array.value.filter(el => el !== p.twitch_display);
  const data = history.map((objeto: Record<string, any>) => {
    const participant = (objeto.participants || []).find((part: Record<string, any>) => part.twitch_display === p.twitch_display);
    return participant ? participant.position : null;
  });
  datasets.value.push({
    label: p.twitch_display,
    fill: false,
    data: data,
    url: `https://static-cdn.jtvnw.net/${p.twitch_picture.replace("300x300", "70x70")}`,
    lp: historyData(p).lp,
    elo: historyData(p).elo,
    tier: historyData(p).tier,
    borderColor: participantColor[p.twitch_display]?.color || "#fff"
  });
}

const addData = () => {
  for (const p of props.data as Record<string, any>[]) {
    if (p.twitch_display === selected.value && !selected_array.value?.includes(selected.value)) {
      selected_array.value?.push(selected.value);
      full_array.value = full_array.value.filter(el => el !== selected.value);
      const data = history.map((objeto: Record<string, any>) => {
        const participant = (objeto.participants || []).find((part: Record<string, any>) => part.twitch_display === p.twitch_display);
        return participant ? participant.position : null;
      });
      datasets.value.push({
        label: p.twitch_display,
        fill: false,
        data: data,
        url: `https://static-cdn.jtvnw.net/${p.twitch_picture.replace("300x300", "70x70")}`,
        lp: historyData(p).lp,
        elo: historyData(p).elo,
        tier: historyData(p).tier,
        borderColor: participantColor[p.twitch_display]?.color || "#fff"
      });
    }
  }
};

const removeData = (name: string) => {
  datasets.value = datasets.value.filter(el => el.label !== name);
  selected_array.value = selected_array.value?.filter(el => el !== name) || null;
  selected.value = "";
  full_array.value.push(name);
  full_array.value.sort((a, b) => {
    return array_order.indexOf(a) - array_order.indexOf(b);
  });
};

const lineData = ref({
  labels: historyLabels,
  datasets: datasets
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  color: "white",
  elements: {
    line: {
      tension: 0.15
    }
  },
  scales: {
    y: {
      reverse: true,
      ticks: {
        color: "white",
        stepSize: 1
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)"
      },
      title: {
        display: true,
        text: "Posición",
        color: "white",
        font: {
          size: 20,
          lineHeight: 1.2
        },
        padding: {top: 5, left: 0, right: 0, bottom: 0}
      }
    },
    x: {
      ticks: {
        color: "white",
        stepSize: 1
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)"
      },
      title: {
        display: true,
        text: "Día",
        color: "white",
        font: {
          size: 20,
          lineHeight: 1.2
        },
        padding: {top: 0, left: 0, right: 0, bottom: 5}
      }
    }
  },
  plugins: {
    tooltip: {
      enabled: false,
      position: "nearest",
      external: externalTooltipHandler
    },
    legend: {
      display: false
    }
  }
});
</script>

<template>
  <div class="d-flex flex-wrap align-items-center mb-2 gap-2">
    <h3 class="fw-bold mb-0">Evolución Diaria del Ranking</h3>
    <h6 class="mb-0 mt-1">(a partir del 3 de marzo)</h6>
  </div>
  <select v-model="selected" class="px-2 py-1" @change="addData()">
    <option disabled value="">Agregar un participante</option>
    <option v-for="(p, i) of full_array" :key="i">
      {{ p }}
    </option>
  </select>
  <div class="d-flex gap-2 my-2 flex-wrap">
    <small v-for="(s, i) of selected_array" :key="i" role="button" class="p-2 bg-secondary d-flex align-items-center rounded user-select-none" @click="removeData(s)">
      <img :src="datasets.filter(el => el.label == s)[0].url" width="32px" class="rounded-circle me-2">
      <span class="d-inline-block me-2" :style="{'border': '2px solid ' + datasets.filter(el => el.label == s)[0].borderColor}" style="width: 12px; height: 12px" />
      <span class="text-decoration-underline me-2" :style="{'text-decoration-color': datasets.filter(el => el.label == s)[0].borderColor + '!important'}" style="text-decoration-thickness: 2px!important">{{ s }}</span>
      <Icon name="ph:x-bold" class="text-muted" />
    </small>
  </div>
  <ClientOnly>
    <Chart type="line" :data="lineData" :options="chartOptions" style="height: 40rem;" class="my-2 bg-secondary rounded" />
  </ClientOnly>
</template>