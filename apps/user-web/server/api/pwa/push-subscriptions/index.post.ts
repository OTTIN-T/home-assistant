/**
 * POST /api/pwa/push-subscriptions
 *
 * Register a push notification subscription
 */

import type { PushSubscriptionPayload } from "../../../types/pwa.types";
import { PushSubscriptionPayloadSchema } from "../../../types/pwa.types";
import { defineEventHandler, readBody, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        // Validate payload
        const validated = PushSubscriptionPayloadSchema.parse(body);

        // TODO: Store subscription
        // await deps.pushSubscriptionService.register(userId, validated);

        setResponseStatus(event, 201);
        return {
            success: true,
            subscriptionId: "sub-" + Math.random().toString(36).substr(2, 9),
            message: "Push subscription registered successfully"
        };
    } catch (error: any) {
        console.error("[PWA API] Push subscription error", error);
        setResponseStatus(event, 400);
        return {
            success: false,
            error: error.message || "Failed to register subscription"
        };
    }
});
