<template>
  <article class="widget button">
    <h4>Action</h4>
    <button @click="$emit('press')">{{ label }}</button>
  </article>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
defineEmits<{ press: [] }>();
</script>

<style scoped>
.widget {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
}
</style>
