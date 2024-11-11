import { Activity, ChallengeRotation, ActivityRotation, SharedLootPools } from "./types";

export interface ActivitiesJson {
  $schema?: string;
  activities: string[];
}

export interface RotationsJson {
  $schema?: string;
  activityRotations: ActivityRotation[];
  challengeRotations: ChallengeRotation[];
}

export interface LootJson {
  $schema?: string;
  sharedLoot: SharedLootPools;
  doubleLootOverrides: string[];
}

export interface ActivityJson {
  $schema?: string;
  activity: Activity;
}
