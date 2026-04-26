/**
 * PWA Cache Policy Service
 *
 * Enforces security policies for caching:
 * - Allowlist: static assets and read-only device states
 * - Denylist: session, profile, authentication, tokens
 */

import type { H3Event } from "h3";

export interface CachePolicy {
    enabled: boolean;
    strategy: "stale_while_revalidate" | "network_first" | "cache_first";
    maxAge: number;
    maxEntries: number;
}

export class PwaCachePolicyService {
    private readonly DENIED_PATTERNS = [
        /\/api\/auth\//,
        /\/api\/profile\//,
        /\/api\/session\//,
        /\/api\/user\//,
        /\/api\/admin\//,
        /\/api\/token/,
        /\.(js|ts)\.map$/,
        /\/__nuxt__\//
    ];

    private readonly ALLOWED_PATTERNS = [
        /\/api\/devices\/?$/,
        /\/api\/devices\/[^\/]+\/state$/,
        /\/assets\//,
        /\/icons\//,
        /\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot)$/
    ];

    /**
     * Check if a URL can be cached
     */
    canCache(url: string): boolean {
        const normalizedPath = this.normalizePath(url);

        // Deny patterns take precedence
        if (this.DENIED_PATTERNS.some((pattern) => pattern.test(normalizedPath))) {
            return false;
        }

        // Allow only explicitly whitelisted patterns
        return this.ALLOWED_PATTERNS.some((pattern) => pattern.test(normalizedPath));
    }

    private normalizePath(url: string): string {
        const [path] = url.split(/[?#]/);
        return (path ?? "").toLowerCase();
    }

    /**
     * Get cache policy for a URL
     */
    getPolicy(url: string): CachePolicy | null {
        if (!this.canCache(url)) {
            return null;
        }

        // Device state endpoints: stale-while-revalidate
        if (/\/api\/devices.*state/.test(url)) {
            return {
                enabled: true,
                strategy: "stale_while_revalidate",
                maxAge: 3600, // 1 hour
                maxEntries: 50
            };
        }

        // Static assets: cache-first
        if (/\.(jpg|jpeg|png|gif|svg|webp|woff|woff2)$/.test(url)) {
            return {
                enabled: true,
                strategy: "cache_first",
                maxAge: 86400 * 30, // 30 days
                maxEntries: 100
            };
        }

        // Default: no caching
        return null;
    }

    /**
     * Validate that sensitive routes are not cached
     */
    validateSecurityCompliance(url: string, method: string): boolean {
        // POST/PUT/DELETE requests should never be cached
        if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
            if (this.canCache(url)) {
                console.warn(
                    `[PWA Cache] Security violation: ${method} ${url} matched cache allowlist`
                );
                return false;
            }
        }

        // Denied patterns must be enforced
        if (this.DENIED_PATTERNS.some((pattern) => pattern.test(url))) {
            if (this.canCache(url)) {
                console.warn(
                    `[PWA Cache] Security violation: ${url} matched denied pattern but is cacheable`
                );
                return false;
            }
        }

        return true;
    }
}

export function createPwaCachePolicyService(): PwaCachePolicyService {
    return new PwaCachePolicyService();
}
