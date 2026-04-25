<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
    <header class="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.24em] text-sky-700">
            Home Assistant Admin
          </p>
          <h1 class="text-lg font-semibold text-slate-950">
            Gouvernance et audit
          </h1>
        </div>

        <nav class="flex flex-wrap items-center gap-2">
          <UButton to="/" color="neutral" variant="ghost">Vue d'ensemble</UButton>
          <UButton to="/users" color="neutral" variant="ghost">Utilisateurs</UButton>
          <UButton to="/devices" color="neutral" variant="ghost">Appareils</UButton>
          <UButton to="/audit" color="neutral" variant="ghost">Audit</UButton>
        </nav>
      </div>
    </header>

    <slot />
  </div>
</template>