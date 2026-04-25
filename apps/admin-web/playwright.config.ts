import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "tests/integration",
    timeout: 30_000,
    use: {
        baseURL: "http://localhost:3001",
        trace: "on-first-retry"
    }
});
