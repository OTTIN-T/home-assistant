import type { BehaviorRuleEntity, UserProfileEntity } from "@home-assistant/shared";

export class BehaviorRuleService {
  public constructor(
    private readonly rules: BehaviorRuleEntity[],
    private readonly profiles: UserProfileEntity[]
  ) {}

  public evaluate(userId: string, context: Record<string, unknown>): BehaviorRuleEntity[] {
    const activeProfile = this.profiles.find((profile) => profile.userId === userId && profile.isActive);
    if (!activeProfile) {
      return [];
    }

    return this.rules.filter((rule) => {
      if (!rule.active || rule.profileId !== activeProfile.id) {
        return false;
      }

      return Object.entries(context).every(([key, value]) => rule.context[key] === value);
    });
  }
}
