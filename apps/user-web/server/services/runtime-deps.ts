import { AuthService } from "./auth.service";
import { BehaviorRuleService } from "./behavior-rule.service";
import { DeviceCommandService } from "./device-command.service";
import { EventPriorityService } from "./event-priority.service";
import { HomeDeviceService } from "./home-device.service";
import { NotificationDispatchService } from "./notification-dispatch.service";
import { UserProfileService } from "./user-profile.service";
import { WidgetConfigurationService } from "./widget-configuration.service";
import { createRuntimeStore, type RuntimeStore } from "./runtime-store";

export function createRuntimeDeps(store: RuntimeStore = createRuntimeStore()) {
  const eventPriorityService = new EventPriorityService();
  const notificationDispatchService = new NotificationDispatchService(
    store.pushSubscriptions,
    eventPriorityService
  );

  return {
    store,
    authService: new AuthService(store.users, store.devices, store.sessions, store.securityEvents),
    homeDeviceService: new HomeDeviceService(store.homeDevices),
    deviceCommandService: new DeviceCommandService(store.commands, store.securityEvents),
    userProfileService: new UserProfileService(store.profiles),
    widgetConfigurationService: new WidgetConfigurationService(store.widgets),
    behaviorRuleService: new BehaviorRuleService(store.behaviorRules, store.profiles),
    eventPriorityService,
    notificationDispatchService
  };
}
