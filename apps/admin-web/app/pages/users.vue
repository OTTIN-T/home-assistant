<template>
  <main class="container">
    <h1>Admin Users</h1>
    <p>Manage user roles from this isolated admin surface.</p>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.email }} - {{ user.role }}</li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAdminStore } from "../stores/admin.store";

const store = useAdminStore();
const users = computed(() => store.users);
</script>
