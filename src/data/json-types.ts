import { Activity, ChallengeRotation, FeaturedRotation, SharedLootPools } from "./types";

export interface ActivitiesJson {
  $schema?: string;
  activities: string[];
}

export interface RotationsJson {
  $schema?: string;
  featuredRotations: FeaturedRotation[];
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
