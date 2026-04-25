<template>
  <section class="dashboard">
    <h2>My Devices</h2>
    <p v-if="message" class="message">{{ message }}</p>
    <div class="grid">
      <DeviceCard
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @command="(action) => onDeviceCommand(device.id, action)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import DeviceCard from "../../bases/device/DeviceCard.component.vue";

defineProps<{
  devices: Array<{
    id: string;
    name: string;
    accessMode: "read_write" | "read_only";
    state: Record<string, unknown>;
  }>;
  message?: string;
}>();

const emit = defineEmits<{
  command: [payload: { deviceId: string; action: "turn_on" | "turn_off" }];
}>();

function onDeviceCommand(deviceId: string, action: "turn_on" | "turn_off") {
  emit("command", { deviceId, action });
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.message {
  color: #0f766e;
}
</style>
