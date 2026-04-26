import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    srcDir: "app/",
    modules: [
        "@nuxt/ui",
        "@pinia/nuxt",
        [
            "@vite-pwa/nuxt",
            {
                manifest: {
                    name: "Home Assistant Web",
                    short_name: "HA Web",
                    description: "Home automation web application with offline support",
                    theme_color: "#ffffff",
                    background_color: "#ffffff",
                    display: "standalone",
                    orientation: "portrait-primary",
                    scope: "/",
                    start_url: "/",
                    dir: "auto"
                },
                workbox: {
                    globPatterns: [
                        "**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot}"
                    ],
                    runtimeCaching: [
                        {
                            urlPattern: "^/api/devices",
                            handler: "StaleWhileRevalidate",
                            options: {
                                cacheName: "devices-state",
                                cacheableResponse: {
                                    statuses: [200]
                                },
                                expiration: {
                                    maxEntries: 50,
                                    maxAgeSeconds: 3600
                                }
                            }
                        }
                    ],
                    navigateFallback: "/",
                    cleanupOutdatedCaches: true
                },
                devOptions: {
                    enabled: false,
                    suppressWarnings: true,
                    navigateFallback: "/"
                },
                strategies: "generateSW",
                registerType: "autoUpdate"
            }
        ]
    ],
    css: ["~/assets/styles/main.css"],
    app: {
        head: {
            link: [
                {
                    rel: "manifest",
                    href: "/manifest.webmanifest"
                },
                {
                    rel: "icon",
                    type: "image/svg+xml",
                    href: "/icons/favicon.svg"
                },
                {
                    rel: "apple-touch-icon",
                    href: "/icons/apple-touch-icon.png"
                }
            ],
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1"
                },
                {
                    name: "theme-color",
                    content: "#ffffff"
                },
                {
                    name: "apple-mobile-web-app-capable",
                    content: "yes"
                },
                {
                    name: "apple-mobile-web-app-status-bar-style",
                    content: "black-translucent"
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
