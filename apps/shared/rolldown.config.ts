import { defineConfig } from "rolldown";

export default defineConfig({
    input: "index.ts",
    output: {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true
    }
});
