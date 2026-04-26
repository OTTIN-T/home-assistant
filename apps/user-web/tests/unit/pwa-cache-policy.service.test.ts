/**
 * Test de non-régression: Politique de cache PWA sécurisée
 *
 * Valide que:
 * - Les endpoints sensibles (auth, session, profil) ne sont pas cachés
 * - Les endpoints de lecture d'équipements (read-only) peuvent être cachés
 * - Les requêtes POST/PUT/DELETE ne sont jamais cachées
 * - La politique de cache est appliquée correctement
 */

import { describe, it, expect } from "vitest";
import { PwaCachePolicyService } from "../../server/services/pwa-cache-policy.service";

describe("PwaCachePolicyService", () => {
    const service = new PwaCachePolicyService();

    describe("Denied patterns (should NOT cache)", () => {
        it("should deny auth routes", () => {
            expect(service.canCache("/api/auth/login")).toBe(false);
            expect(service.canCache("/api/auth/logout")).toBe(false);
            expect(service.canCache("/api/auth/refresh")).toBe(false);
        });

        it("should deny profile routes", () => {
            expect(service.canCache("/api/profile/me")).toBe(false);
            expect(service.canCache("/api/profile/settings")).toBe(false);
        });

        it("should deny session routes", () => {
            expect(service.canCache("/api/session/active")).toBe(false);
            expect(service.canCache("/api/session/validate")).toBe(false);
        });

        it("should deny user routes", () => {
            expect(service.canCache("/api/user/me")).toBe(false);
            expect(service.canCache("/api/user/preferences")).toBe(false);
        });

        it("should deny admin routes", () => {
            expect(service.canCache("/api/admin/users")).toBe(false);
            expect(service.canCache("/api/admin/audit")).toBe(false);
        });

        it("should deny token routes", () => {
            expect(service.canCache("/api/token/refresh")).toBe(false);
            expect(service.canCache("/api/token/validate")).toBe(false);
        });

        it("should deny source maps", () => {
            expect(service.canCache("/app.js.map")).toBe(false);
            expect(service.canCache("/vendor.js.map")).toBe(false);
        });

        it("should deny Nuxt internal routes", () => {
            expect(service.canCache("/__nuxt__/builds/xyz")).toBe(false);
        });
    });

    describe("Allowed patterns (can cache)", () => {
        it("should allow device state endpoints", () => {
            expect(service.canCache("/api/devices")).toBe(true);
            expect(service.canCache("/api/devices/123/state")).toBe(true);
        });

        it("should allow static assets", () => {
            expect(service.canCache("/assets/image.png")).toBe(true);
            expect(service.canCache("/assets/style.css")).toBe(true);
        });

        it("should allow icon files", () => {
            expect(service.canCache("/icons/192x192.png")).toBe(true);
            expect(service.canCache("/icons/512x512.png")).toBe(true);
        });

        it("should allow font files", () => {
            expect(service.canCache("/fonts/roboto.woff")).toBe(true);
            expect(service.canCache("/fonts/roboto.woff2")).toBe(true);
        });

        it("should allow image formats", () => {
            expect(service.canCache("/img/logo.jpg")).toBe(true);
            expect(service.canCache("/img/banner.webp")).toBe(true);
            expect(service.canCache("/img/icon.svg")).toBe(true);
        });
    });

    describe("Cache policies", () => {
        it("should return stale-while-revalidate for device state", () => {
            const policy = service.getPolicy("/api/devices/123/state");
            expect(policy).not.toBeNull();
            expect(policy?.strategy).toBe("stale_while_revalidate");
            expect(policy?.maxAge).toBe(3600);
        });

        it("should return cache-first for static assets", () => {
            const policy = service.getPolicy("/fonts/roboto.woff2");
            expect(policy).not.toBeNull();
            expect(policy?.strategy).toBe("cache_first");
            expect(policy?.maxAge).toBeGreaterThan(86400 * 20); // > 20 days
        });

        it("should return null for denied patterns", () => {
            const policy = service.getPolicy("/api/auth/login");
            expect(policy).toBeNull();
        });
    });

    describe("Security compliance validation", () => {
        it("should detect POST to cacheable endpoints as violation", () => {
            const isCompliant = service.validateSecurityCompliance(
                "/api/devices",
                "POST"
            );
            expect(isCompliant).toBe(false);
        });

        it("should allow GET on cacheable endpoints", () => {
            const isCompliant = service.validateSecurityCompliance(
                "/api/devices/123/state",
                "GET"
            );
            expect(isCompliant).toBe(true);
        });

        it("should detect caching of denied patterns as violation", () => {
            // This would only fail if canCache() returns true for denied patterns
            // which should never happen, but test the logic anyway
            const policy = service.getPolicy("/api/auth/login");
            if (policy) {
                const isCompliant = service.validateSecurityCompliance(
                    "/api/auth/login",
                    "GET"
                );
                expect(isCompliant).toBe(false);
            }
        });

        it("should allow all methods on denied patterns", () => {
            for (const method of ["GET", "POST", "PUT", "DELETE", "PATCH"]) {
                const isCompliant = service.validateSecurityCompliance(
                    "/api/profile/me",
                    method
                );
                expect(isCompliant).toBe(true);
            }
        });
    });

    describe("Edge cases", () => {
        it("should handle case-insensitive extensions", () => {
            expect(service.canCache("/logo.PNG")).toBe(true);
            expect(service.canCache("/image.SVG")).toBe(true);
        });

        it("should handle query parameters", () => {
            // URLs with query params should still match patterns
            const url = "/api/devices?filter=active";
            // Note: patterns match the URL structure, not query strings
            expect(service.canCache(url)).toBe(true);
        });

        it("should handle trailing slashes", () => {
            expect(service.canCache("/api/devices/")).toBe(true);
            expect(service.canCache("/api/auth/login/")).toBe(false);
        });
    });
});
