<template>
<main class="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
    <div class="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section class="flex flex-col justify-center gap-5">
            <UBadge color="primary" variant="soft" class="w-fit">
                Authentification forte
            </UBadge>
            <div class="space-y-3">
                <h1 class="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                    Connexion utilisateur + appareil
                </h1>
                <p class="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    L'acces est reserve aux utilisateurs autorises et aux terminaux enregistres. Utilisez vos
                    identifiants et l'empreinte de l'appareil pour ouvrir une session valide.
                </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
                <UCard class="border-slate-200/80 bg-white/90 ring-1 ring-slate-200/70">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Etape 1</p>
                    <p class="mt-2 text-sm font-medium text-slate-950">Verifier l'identite</p>
                </UCard>
                <UCard class="border-slate-200/80 bg-white/90 ring-1 ring-slate-200/70">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Etape 2</p>
                    <p class="mt-2 text-sm font-medium text-slate-950">Valider l'appareil</p>
                </UCard>
                <UCard class="border-slate-200/80 bg-white/90 ring-1 ring-slate-200/70">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Etape 3</p>
                    <p class="mt-2 text-sm font-medium text-slate-950">Ouvrir la session</p>
                </UCard>
            </div>
        </section>

        <UCard :ui="{ header: 'px-6 py-5', body: 'px-6 py-6' }"
            class="border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-200/70">
            <template #header>
                <div class="space-y-2">
                    <h2 class="text-xl font-semibold text-slate-950">
                        Sign in
                    </h2>
                    <p class="text-sm text-slate-600">
                        Renseignez les informations de session attendues par l'API d'authentification.
                    </p>
                </div>
            </template>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Email</label>
                    <UInput v-model="email" type="email" icon="i-lucide-mail" required />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Password</label>
                    <UInput v-model="password" type="password" icon="i-lucide-lock" minlength="12" required />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Device fingerprint</label>
                    <UInput v-model="deviceFingerprint" type="text" icon="i-lucide-smartphone" required />
                </div>

                <UAlert v-if="errorMessage" color="error" variant="soft" title="Authentification refusee"
                    :description="errorMessage" />

                <UButton type="submit" color="primary" variant="solid" block :loading="loading">
                    {{ loading ? "Connexion en cours" : "Se connecter" }}
                </UButton>
            </form>
        </UCard>
    </div>
</main>
</template>

<script setup lang="ts">
import { navigateTo, useNuxtApp } from "#app";
import { definePageMeta } from "#imports";
import { ref } from "vue";

definePageMeta({
    layout: "auth"
});

const email = ref("user@example.com");
const password = ref("very-secure-password");
const deviceFingerprint = ref("device-fp-001");
const loading = ref(false);
const errorMessage = ref("");
void useNuxtApp;

async function onSubmit() {
    loading.value = true;
    errorMessage.value = "";

    try {
        const response = await fetch("/api/v1/auth/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                deviceFingerprint: deviceFingerprint.value
            })
        });

        if (!response.ok) {
            throw new Error("Authentication failed");
        }

        const data = (await response.json()) as { token: string; userId: string; deviceId: string };

        localStorage.setItem("auth.token", data.token);
        localStorage.setItem("auth.deviceFingerprint", deviceFingerprint.value);
        await navigateTo("/");
    } catch {
        errorMessage.value = "Authentication failed";
    } finally {
        loading.value = false;
    }
}
</script>
