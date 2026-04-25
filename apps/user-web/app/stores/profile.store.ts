import { defineStore } from "pinia";

export interface ProfileItem {
  id: string;
  name: string;
  isActive: boolean;
}

export interface WidgetItem {
  id?: string;
  widgetType: string;
  position: number;
  visible: boolean;
  parameters?: Record<string, unknown>;
}

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profiles: [] as ProfileItem[],
    widgets: [] as WidgetItem[],
    message: ""
  }),
  actions: {
    setProfiles(profiles: ProfileItem[]) {
      this.profiles = profiles;
    },
    addProfile(profile: ProfileItem) {
      this.profiles.push(profile);
    },
    setActiveProfile(profileId: string) {
      this.profiles = this.profiles.map((profile) => ({
        ...profile,
        isActive: profile.id === profileId
      }));
    },
    setWidgets(widgets: WidgetItem[]) {
      this.widgets = widgets;
    },
    setMessage(message: string) {
      this.message = message;
    }
  }
});
