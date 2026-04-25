<template>
  <main class="container">
    <h1>Registered Devices</h1>
    <p>Revoke devices and enforce immediate session invalidation.</p>
    <ul>
      <li v-for="device in devices" :key="device.id">{{ device.displayName }} - {{ device.status }}</li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAdminStore } from "../stores/admin.store";

const store = useAdminStore();
const devices = computed(() => store.devices);
</script>
