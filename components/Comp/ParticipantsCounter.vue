<script setup lang="ts">
const props = defineProps({
  data: { type: Object, required: true },
});
</script>

<template>
  <div class="d-flex gap-1 align-items-center mb-2">
    <Icon name="fa6-solid:user-group" />
    <span>{{ props.data ? props.data.length : 0 }} participantes</span>
  </div>
</template>