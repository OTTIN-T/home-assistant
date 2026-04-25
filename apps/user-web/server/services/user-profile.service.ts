import type { ProfileCreateRequest, ProfileContract } from "@home-assistant/shared";
import type { UserProfileEntity } from "@home-assistant/shared";

export class UserProfileService {
  public constructor(private readonly profiles: UserProfileEntity[]) {}

  public list(userId: string): ProfileContract[] {
    return this.profiles
      .filter((profile) => profile.userId === userId)
      .map((profile) => ({ id: profile.id, name: profile.name, isActive: profile.isActive }));
  }

  public create(userId: string, input: ProfileCreateRequest): ProfileContract {
    const now = new Date().toISOString();
    const profile: UserProfileEntity = {
      id: crypto.randomUUID(),
      userId,
      name: input.name,
      isActive: this.profiles.filter((item) => item.userId === userId).length === 0,
      uiPreferences: input.uiPreferences,
      createdAt: now,
      updatedAt: now
    };

    this.profiles.push(profile);

    return { id: profile.id, name: profile.name, isActive: profile.isActive };
  }

  public activate(userId: string, profileId: string): ProfileContract {
    const target = this.profiles.find((profile) => profile.id === profileId && profile.userId === userId);
    if (!target) {
      throw new Error("Profile not found");
    }

    for (const profile of this.profiles) {
      if (profile.userId === userId) {
        profile.isActive = profile.id === profileId;
        profile.updatedAt = new Date().toISOString();
      }
    }

    return { id: target.id, name: target.name, isActive: true };
  }

  public getActiveProfile(userId: string): UserProfileEntity | undefined {
    return this.profiles.find((profile) => profile.userId === userId && profile.isActive);
  }
}
