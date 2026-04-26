<template>
  <section class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-3">
        <UBadge color="neutral" variant="soft" class="w-fit">
          Administration isolee
        </UBadge>
        <div class="space-y-2">
          <h1 class="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {{ title }}
          </h1>
          <p class="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {{ description }}
          </p>
        </div>
      </div>

      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-3">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="stats.length > 0" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <UCard v-for="stat in stats" :key="stat.label" :ui="{ body: 'p-5 sm:p-6' }"
        class="border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/70">
        <div class="space-y-2">
          <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {{ stat.label }}
          </p>
          <div class="flex items-center justify-between gap-3">
            <p class="text-2xl font-semibold text-slate-950">
              {{ stat.value }}
            </p>
            <UBadge v-if="stat.tone" :color="stat.tone" variant="soft">
              {{ stat.caption ?? stat.tone }}
            </UBadge>
            <p v-else-if="stat.caption" class="text-xs text-slate-500">
              {{ stat.caption }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
interface AdminPageStat {
  label: string;
  value: string | number;
  caption?: string;
  tone?: "primary" | "success" | "warning" | "error" | "neutral";
}

withDefaults(
  defineProps<{
    title: string;
    description: string;
    stats?: AdminPageStat[];
  }>(),
  {
    stats: () => []
  }
);
</script>
