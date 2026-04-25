<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f0fdfa_100%)]">
    <header class="border-b border-emerald-100/80 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.24em] text-emerald-700">
            Home Assistant Access
          </p>
          <h1 class="text-lg font-semibold text-slate-950">
            Authentification utilisateur et appareil
          </h1>
        </div>

        <nav class="flex flex-wrap items-center gap-2">
          <UButton to="/login" color="primary" variant="soft">Connexion securisee</UButton>
          <UButton to="/" color="neutral" variant="ghost">Retour au tableau de bord</UButton>
        </nav>
      </div>
    </header>

    <slot />
  </div>
</template>