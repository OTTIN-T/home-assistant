import { describe, expect, it } from "vitest";
import { ProviderService } from "../../server/services/provider.service";
import type { HomeDeviceEntity, ProviderEntity } from "@home-assistant/shared";

function fixtures() {
    const providers: ProviderEntity[] = [
        {
            id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            name: "Main Provider",
            status: "available",
            lastHeartbeatAt: new Date().toISOString()
        }
    ];

    const homeDevices: HomeDeviceEntity[] = [
        {
            id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
            providerId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            name: "Light",
            category: "light",
            capabilities: { actions: ["turn_on"] },
            currentState: { power: "off" },
            accessMode: "read_write",
            updatedAt: new Date().toISOString()
        }
    ];

    return { providers, homeDevices };
}

describe("ProviderService", () => {
    it("switches related devices to read_only when provider is unavailable", () => {
        const data = fixtures();
        const service = new ProviderService(data.providers, data.homeDevices);

        service.setProviderStatus("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "unavailable");

        expect(data.homeDevices[0].accessMode).toBe("read_only");
    });

    it("restores read_write mode when provider recovers", () => {
        const data = fixtures();
        const service = new ProviderService(data.providers, data.homeDevices);

        service.setProviderStatus("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "unavailable");
        service.setProviderStatus("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "available");

        expect(data.homeDevices[0].accessMode).toBe("read_write");
    });
});
