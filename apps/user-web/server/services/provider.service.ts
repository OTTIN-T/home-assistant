import type { HomeDeviceEntity, ProviderEntity } from "@home-assistant/shared";

export class ProviderService {
    public constructor(
        private readonly providers: ProviderEntity[],
        private readonly homeDevices: HomeDeviceEntity[]
    ) { }

    public setProviderStatus(providerId: string, status: ProviderEntity["status"]): ProviderEntity {
        const provider = this.providers.find((item) => item.id === providerId);
        if (!provider) {
            throw new Error("Provider not found");
        }

        provider.status = status;
        provider.lastHeartbeatAt = new Date().toISOString();

        const nextAccessMode = status === "available" ? "read_write" : "read_only";
        for (const device of this.homeDevices) {
            if (device.providerId === providerId) {
                device.accessMode = nextAccessMode;
                device.updatedAt = new Date().toISOString();
            }
        }

        return provider;
    }
}
