<template>
  <main class="container">
    <h1>Sign in</h1>
    <form class="auth-form" @submit.prevent="onSubmit">
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>
      <label>
        Password
        <input v-model="password" type="password" minlength="12" required />
      </label>
      <label>
        Device fingerprint
        <input v-model="deviceFingerprint" type="text" required />
      </label>
      <button type="submit" :disabled="loading">{{ loading ? "Signing in..." : "Sign in" }}</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </main>
</template>

<script setup lang="ts">
import { navigateTo, useNuxtApp } from "#app";
import { ref } from "vue";

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

<style scoped>
.auth-form {
  display: grid;
  gap: 0.75rem;
  max-width: 420px;
}

label {
  display: grid;
  gap: 0.25rem;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
}

button {
  border: none;
  border-radius: 0.5rem;
  background: #0f766e;
  color: #fff;
  padding: 0.6rem 1rem;
}

.error {
  color: #b91c1c;
}
</style>
