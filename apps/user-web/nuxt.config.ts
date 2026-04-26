import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    srcDir: "app/",
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    css: ["~/assets/styles/main.css"],
    app: {
        head: {
            link: [
                {
                    rel: "manifest",
                    href: "/manifest.webmanifest"
                }
            ]
        }
    },
    runtimeConfig: {
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
            pushPublicVapidKey: process.env.NUXT_PUSH_PUBLIC_VAPID_KEY
        }
    },
    typescript: {
        strict: true,
        typeCheck: true
    }
});
