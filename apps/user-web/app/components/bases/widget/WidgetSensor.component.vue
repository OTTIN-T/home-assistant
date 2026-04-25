<template>
  <article class="widget sensor">
    <h4>Sensor</h4>
    <p>{{ label }}: {{ value }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: number | string;
}>();
</script>

<style scoped>
.widget {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
}
</style>
