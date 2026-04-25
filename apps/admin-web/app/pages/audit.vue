<template>
  <main class="container">
    <h1>Security Audit</h1>
    <p>Review security and admin events.</p>
    <ul>
      <li v-for="event in audit" :key="event.id">{{ event.createdAt }} - {{ event.eventType }} - {{ event.severity }}</li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAdminStore } from "../stores/admin.store";

const store = useAdminStore();
const audit = computed(() => store.audit);
</script>
