<template>
  <section class="profile-manager">
    <h2>Profiles</h2>
    <form class="row" @submit.prevent="emitCreate">
      <input v-model="newProfileName" type="text" placeholder="New profile name" required />
      <button type="submit">Create profile</button>
    </form>

    <ul>
      <li v-for="profile in profiles" :key="profile.id">
        <span>{{ profile.name }} <strong v-if="profile.isActive">(active)</strong></span>
        <button v-if="!profile.isActive" @click="$emit('activate', profile.id)">Activate</button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const newProfileName = ref("");

const props = defineProps<{
  profiles: Array<{ id: string; name: string; isActive: boolean }>;
}>();
void props;

const emit = defineEmits<{
  create: [name: string];
  activate: [profileId: string];
}>();

function emitCreate() {
  if (!newProfileName.value.trim()) {
    return;
  }
  emit("create", newProfileName.value.trim());
  newProfileName.value = "";
}
</script>

<style scoped>
.profile-manager {
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 1rem;
}

.row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

ul {
  margin: 0;
  padding-left: 1rem;
}
</style>
