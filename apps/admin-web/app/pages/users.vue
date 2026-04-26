<template>
<FeatureAdminPageShell title="Gestion des utilisateurs"
    description="Ajustez les droits applicatifs depuis une surface d'administration isolee, avec une trace visible des changements de role les plus recents."
    :stats="stats">
    <FeatureAdminSectionCard title="Affectations de roles"
        description="Les changements appliques ici doivent etre reproduits a la session suivante de l'utilisateur cible.">
        <div class="space-y-4">
            <div class="grid gap-4 xl:grid-cols-2">
                <article v-for="user in users" :key="user.id"
                    class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div class="space-y-2">
                            <div class="flex flex-wrap items-center gap-2">
                                <p class="text-sm font-semibold text-slate-950">
                                    {{ user.email }}
                                </p>
                                <UBadge :color="user.role === 'admin' ? 'warning' : 'neutral'" variant="soft">
                                    {{ user.role }}
                                </UBadge>
                                <UBadge :color="user.status === 'active' ? 'success' : 'error'" variant="subtle">
                                    {{ user.status }}
                                </UBadge>
                            </div>

                            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                                Derniere mise a jour: {{ formatDateTime(user.lastRoleChangeAt) }}
                            </p>
                            <p class="text-sm text-slate-600">
                                Identifiant cible: {{ user.id }}
                            </p>
                        </div>

                        <div class="flex w-full max-w-xs flex-col gap-2">
                            <label class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                                Nouveau role
                            </label>
                            <USelect :model-value="user.role" :items="roleItems"
                                @update:model-value="onRoleUpdate(user.id, $event)" />
                        </div>
                    </div>
                </article>
            </div>

            <UAlert color="info" variant="soft" title="Controle de gouvernance"
                description="Chaque changement de role doit generer un evenement de securite de type role_change consultable dans l'audit." />
        </div>
    </FeatureAdminSectionCard>
</FeatureAdminPageShell>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FeatureAdminPageShell from "../components/features/admin/FeatureAdminPageShell.component.vue";
import FeatureAdminSectionCard from "../components/features/admin/FeatureAdminSectionCard.component.vue";
import { useAdminStore } from "../stores/admin.store";

const store = useAdminStore();

const users = computed(() => store.users);
const stats = computed(() => [
    { label: "Utilisateurs suivis", value: store.stats.totalUsers, tone: "neutral" as const },
    { label: "Admins actifs", value: store.stats.privilegedUsers, tone: "warning" as const },
    { label: "Appareils revoques", value: store.stats.revokedDevices, tone: "error" as const },
    { label: "Evenements critiques", value: store.stats.criticalEvents, tone: "primary" as const }
]);

const roleItems = [
    { label: "Utilisateur", value: "user" },
    { label: "Administrateur", value: "admin" }
] as const;

function onRoleChange(userId: string, value: string | undefined) {
    if (value === "admin" || value === "user") {
        store.updateUserRole(userId, value);
    }
}

function onRoleUpdate(userId: string, value: unknown) {
    onRoleChange(userId, typeof value === "string" ? value : undefined);
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}
</script>
