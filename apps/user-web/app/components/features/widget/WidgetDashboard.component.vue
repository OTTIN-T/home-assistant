<template>
  <section class="widget-dashboard">
    <h2>Widget Dashboard</h2>
    <div class="controls">
      <button @click="$emit('add', 'status')">Add status</button>
      <button @click="$emit('add', 'button')">Add button</button>
      <button @click="$emit('add', 'sensor')">Add sensor</button>
      <button @click="$emit('save')">Save layout</button>
    </div>

    <ul>
      <li v-for="item in widgets" :key="item.id ?? `${item.widgetType}-${item.position}`" class="row">
        <span>{{ item.widgetType }} @ {{ item.position }}</span>
        <label>
          Visible
          <input type="checkbox" :checked="item.visible" @change="$emit('toggle', item.position)" />
        </label>
        <button @click="$emit('remove', item.position)">Remove</button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  widgets: Array<{
    id?: string;
    widgetType: string;
    position: number;
    visible: boolean;
    parameters?: Record<string, unknown>;
  }>;
}>();

defineEmits<{
  add: [type: "status" | "button" | "sensor"];
  toggle: [position: number];
  remove: [position: number];
  save: [];
}>();
</script>

<style scoped>
.widget-dashboard {
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 1rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
