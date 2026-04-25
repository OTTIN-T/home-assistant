<template>
  <UCard
    :ui="{ header: 'px-5 py-4', body: 'px-5 py-4' }"
    class="border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-200/70"
  >
    <template #header>
      <div class="space-y-2">
        <h2 class="text-lg font-semibold text-slate-950">
          Profils
        </h2>
        <p class="text-sm text-slate-600">
          Creez et activez un profil pour ajuster rapidement le tableau de bord selon le contexte d'usage.
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="emitCreate">
        <UInput
          v-model="newProfileName"
          class="flex-1"
          placeholder="Nouveau nom de profil"
          icon="i-lucide-user-round-cog"
        />
        <UButton type="submit" color="primary" variant="solid">
          Creer le profil
        </UButton>
      </form>

      <div class="space-y-3">
        <article
          v-for="profile in profiles"
          :key="profile.id"
          class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <UBadge :color="profile.isActive ? 'success' : 'neutral'" variant="soft">
              {{ profile.isActive ? "Actif" : "Inactif" }}
            </UBadge>
            <p class="text-sm font-medium text-slate-950">
              {{ profile.name }}
            </p>
          </div>

          <UButton
            v-if="!profile.isActive"
            color="neutral"
            variant="outline"
            @click="$emit('activate', profile.id)"
          >
            Activer
          </UButton>
        </article>
      </div>
    </div>
  </UCard>
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
