export type ActivityType =
  | "raid"
  | "dungeon"
  | "nightfall"
  | "exotic_mission"
  | "lost_sector"
  | "encounter";

export type ActivityTag =
  | "featured-newest"
  | "featured-farmable"
  | "featured-rotating"
  | "challenge-active"
  | "pinnacle"
  | "double-loot-active"
  | "not-available-rotating";

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  description: string;
  backgroundImage: string;
  location?: string;
  tagOverrides?: ActivityTag[];

  loot?: LootPool[];
  triumphs?: Triumph[];
  guides?: string[];
  secretChests?: SecretChest[];
  extraPuzzles?: ExtraPuzzle[];

  encounters?: (Activity & { type: "encounter" })[];
}

export interface ActivityAvailability {
  featured?: "newest" | "farmable" | "weekly" | false;
  masterAvailable?: boolean;
  challengeActive?: boolean;
  doubleLootActive?: boolean;
}

export type Loot = {
  artiface?: boolean;
  statFocused?: boolean;
  quantity?: number;
  deepsight?: "chance" | "guaranteed";
} & (
  | {
      type: "item";
      itemHash: number;
    }
  | {
      type: "group";
      name?: string;
      groupType: string;
      displayItemHash?: number;
      displayStaticIcon?:
        | "helmet"
        | "gauntlets"
        | "chest-armor"
        | "leg-armor"
        | "class-item"
        | "weapon"
        | "legendary-engram"
        | "exotic-engram"
        | "bright-engram"
        | "prime-engram";
      children: Loot[];
    }
);

export type LootPool =
  | {
      type: "mode_specific";
      modes: {
        mode: string;
        bungieActivityHash: number;
        children: LootPool[];
      }[];
    }
  | {
      type: "pool";
      loot: Loot[];
      quantity: number | "chance" | "all";
      notes?: string[];
      showInLootSummary?: boolean;
      knockout?: boolean;

      // Pinnacle notes (default: never)
      pinnacleWhen?:
        | "never" // no note
        | "activity_is_featured" // if featured: "Activity is featured: first drop this week (per character) will be pinnacle"
        | "always"; // "First drop each week (per character) is pinnacle"

      // Limit notes (default: infinite)
      weeklyLimit?:
        | "infinite" // no note
        | "infinite_when_featured" // if featured: "Activity is featured: will drop every completion" / "chance to drop every completion"
        | "infinite_after_first_clear" // "Only available after first clear per character"
        | "once_per_character" // "Only available once per character"
        | "once_per_account"; // "Only available once per account"

      // Availability notes (default: always)
      availableWhen?:
        | "activity_is_featured" // if not featured: "Activity is not featured: will not drop this week"
        | "activity_not_featured" // if featured: "Activity is featured: will not drop this week"
        | "challenge_completion" // "Only available on challenge completion"
        | "always"; // no note

      // Double loot notes (default: never)
      doubleLootWhen?:
        | "never" // no note
        | "double_loot_is_active" // if featured: "Double loot is active this week: drops doubled"
        | "challenge_completion" // "Double loot on challenge completion"
        | "challenge_completion_repeatable"; // "Double loot on challenge completion"
    };

export interface Triumph {
  name: string;
  description: string;
  bungieRecordHash: number;
}

export interface SecretChest {
  name: string;
  description: string;
  backgroundImage: string;
  loot: LootPool[];
}

export interface ExtraPuzzle {
  name: string;
  description: string;
  loot: LootPool[];
}

export interface SharedLootPools {
  loot?: Record<string, Loot>;
  pools?: Record<string, LootPool>;
}

export type FeaturedRotation =
  | {
      id: string;
      type: "weekly" | "daily";
      activityType: ActivityType;
      startDate: string;
      rotation: string[][];
    }
  | {
      id: string;
      type: "newest";
      activityType: ActivityType;
      activityId: string;
    };

export interface JsonData {
  $schema?: string;
  activities: Activity[];
  sharedLoot?: SharedLootPools;
  featuredRotations: FeaturedRotation[];
  doubleLootOverrides: string[];
}
