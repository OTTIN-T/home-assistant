import { storeToRefs } from "pinia";
import { useProfileStore } from "../stores/profile.store";

export function useProfilePersonalization() {
  const store = useProfileStore();
  const { profiles, widgets, message } = storeToRefs(store);

  async function createProfile(name: string) {
    const response = await fetch("/api/v1/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, uiPreferences: {} })
    });

    if (!response.ok) {
      store.setMessage("Profile creation failed");
      return;
    }

    const profile = (await response.json()) as { id: string; name: string; isActive: boolean };
    store.addProfile(profile);
    store.setMessage("Profile created");
  }

  async function activateProfile(profileId: string) {
    const response = await fetch(`/api/v1/profiles/${profileId}/activate`, { method: "POST" });
    if (!response.ok) {
      store.setMessage("Profile activation failed");
      return;
    }

    store.setActiveProfile(profileId);
    store.setMessage("Profile activated");
  }

  async function saveWidgetsLayout() {
    const response = await fetch("/api/v1/widgets/layout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgets: widgets.value })
    });

    store.setMessage(response.ok ? "Widget layout saved" : "Widget layout save failed");
  }

  function addWidget(type: "status" | "button" | "sensor") {
    const nextPosition = widgets.value.length;
    store.setWidgets([
      ...widgets.value,
      {
        widgetType: type,
        position: nextPosition,
        visible: true,
        parameters: {}
      }
    ]);
  }

  function removeWidget(position: number) {
    const next = widgets.value
      .filter((item) => item.position !== position)
      .map((item, index) => ({ ...item, position: index }));
    store.setWidgets(next);
  }

  function toggleWidget(position: number) {
    store.setWidgets(
      widgets.value.map((item) =>
        item.position === position ? { ...item, visible: !item.visible } : item
      )
    );
  }

  return {
    profiles,
    widgets,
    message,
    createProfile,
    activateProfile,
    saveWidgetsLayout,
    addWidget,
    removeWidget,
    toggleWidget
  };
}
