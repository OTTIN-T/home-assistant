import { defineStore } from "pinia";

export interface AdminUserItem {
  id: string;
  email: string;
  role: "admin" | "user";
}

export interface AdminDeviceItem {
  id: string;
  displayName: string;
  status: "pending" | "authorized" | "revoked";
}

export interface AdminAuditItem {
  id: string;
  eventType: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
}

export const useAdminStore = defineStore("admin", {
  state: () => ({
    users: [] as AdminUserItem[],
    devices: [] as AdminDeviceItem[],
    audit: [] as AdminAuditItem[],
    message: ""
  }),
  actions: {
    setUsers(users: AdminUserItem[]) {
      this.users = users;
    },
    setDevices(devices: AdminDeviceItem[]) {
      this.devices = devices;
    },
    setAudit(audit: AdminAuditItem[]) {
      this.audit = audit;
    },
    setMessage(message: string) {
      this.message = message;
    }
  }
});
