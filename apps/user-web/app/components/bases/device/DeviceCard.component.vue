<template>
  <article class="device-card" :class="{ readonly: device.accessMode === 'read_only' }">
    <header>
      <h3>{{ device.name }}</h3>
      <span class="badge">{{ device.accessMode }}</span>
    </header>
    <p>Power: {{ device.state.power ?? "unknown" }}</p>
    <div class="actions">
      <button :disabled="device.accessMode === 'read_only'" @click="$emit('command', 'turn_on')">Turn on</button>
      <button :disabled="device.accessMode === 'read_only'" @click="$emit('command', 'turn_off')">Turn off</button>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  device: {
    id: string;
    name: string;
    accessMode: "read_write" | "read_only";
    state: Record<string, unknown>;
  };
}>();

defineEmits<{
  command: [action: "turn_on" | "turn_off"];
}>();
</script>

<style scoped>
.device-card {
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 1rem;
}

.device-card.readonly {
  opacity: 0.75;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  font-size: 0.75rem;
  text-transform: uppercase;
  background: #e2e8f0;
  border-radius: 999px;
  padding: 0.2rem 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
