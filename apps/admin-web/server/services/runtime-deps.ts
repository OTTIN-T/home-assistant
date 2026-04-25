import { AdminDeviceService } from "./admin-device.service";
import { AdminUserService } from "./admin-user.service";
import { createAdminRuntimeStore, type AdminRuntimeStore } from "./runtime-store";

export function createAdminRuntimeDeps(store: AdminRuntimeStore = createAdminRuntimeStore()) {
  return {
    store,
    adminUserService: new AdminUserService(store.users, store.securityEvents),
    adminDeviceService: new AdminDeviceService(store.devices, store.sessions, store.securityEvents)
  };
}
