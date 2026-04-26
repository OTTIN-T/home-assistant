<template>
<div
    class="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)]">
    <header class="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div
            class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
                <p class="text-xs font-medium uppercase tracking-[0.24em] text-cyan-700">
                    Home Assistant User
                </p>
                <h1 class="text-lg font-semibold text-slate-950">
                    Controle et personnalisation
                </h1>
            </div>

            <nav class="flex flex-wrap items-center gap-2">
                <UButton to="/" color="neutral" variant="ghost">Tableau de bord</UButton>
                <UButton to="/login" color="neutral" variant="ghost">Connexion</UButton>
            </nav>
        </div>
    </header>

    <slot />
</div>
</template>
