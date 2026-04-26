import { defineConfig } from "@vite-pwa/assets-generator/config";

export default defineConfig({
    headLinkOptions: {
        preset: "2023"
    },
    preset: {
        transparent: {
            sizes: [192, 512],
            favicons: [[192], [512]],
            padded: true
        },
        maskable: {
            sizes: [192, 384, 512],
            favicons: [[192, 384], [512]]
        },
        apple: {
            sizes: [120, 152, 167, 180],
            favicons: [[120], [152], [167], [180]]
        }
    },
    images: [
        "public/logo.svg"
    ]
});
