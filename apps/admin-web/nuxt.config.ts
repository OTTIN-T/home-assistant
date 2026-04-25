import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    srcDir: "app/",
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    css: ["~/assets/styles/main.css"],
    runtimeConfig: {
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
            adminAllowedRoles: process.env.ADMIN_ALLOWED_ROLES ?? "admin"
        }
    },
    typescript: {
        strict: true,
        typeCheck: true
    }
});
