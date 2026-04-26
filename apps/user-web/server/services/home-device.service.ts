import type { HomeDeviceEntity } from "@home-assistant/shared";

export class HomeDeviceService {
    public constructor(private readonly homeDevices: HomeDeviceEntity[]) { }

    public listVisibleDevices(): HomeDeviceEntity[] {
        return this.homeDevices;
    }

    public getById(deviceId: string): HomeDeviceEntity | undefined {
        return this.homeDevices.find((device) => device.id === deviceId);
    }
}
