export type ActivityType = "raid" | "dungeon" | "nightfall" | "exotic_mission" | "lost_sector";

export type ActivityTags =
  | "featured-newest"
  | "featured-farmable"
  | "featured-rotating"
  | "challenge-active"
  | "pinnacle"
  | "double-loot-active"
  | "not-available-rotating";

export interface Activity {
  type: ActivityType;

  id: string;
  name: string;
  location: string;
  backgroundImage: string;

  bungieActivityHash: number;

  encounters: Encounter[];
  triumphs: Triumph[];
  loot: LootPool[];
  secretChests: SecretChest[];
  extraPuzzles: ExtraPuzzle[];
}

export type Loot =
  | {
      type: "item";
      itemHash: number;
      deepsight?: "chance" | "guaranteed";
      artiface?: boolean;
      quantity?: number;
    }
  | {
      type: "group";
      name?: string;
      groupType: string;
      displayItemHash?: number;
      displayStaticIcon?:
        | "helmet"
        | "arm-armor"
        | "chest-armor"
        | "leg-armor"
        | "class-item"
        | "weapon"
        | "legendary-engram"
        | "exotic-engram"
        | "bright-engram"
        | "prime-engram";
      artiface?: boolean;
      quantity?: number;
      children: Loot[];
    };

export type LootPool =
  | {
      type: "mode_specific";
      modes: { mode: string; bungieActivityHash: number; children: LootPool[] }[];
    }
  | {
      type: "pool";
      loot: Loot[];
      quantity: number | "chance";
      notes?: string[];
      showInLootSummary?: boolean;

      // Adds a "First drop each week (per character) is pinnacle" note
      pinnacleWhen:
        | "never" // no note
        | "activity_is_featured" // if featured: "Activity is featured: first drop this week (per character) will be pinnacle"
        | "always"; // "First drop each week (per character) is pinnacle"

      // Changes the tag
      weeklyLimit:
        | "infinite" // no note
        | "infinite_when_featured" // if featured: "Activity is featured: will drop every completion" / "chance to drop every completion"
        | "infinite_after_first_clear" // "Only available after first clear per character"
        | "once_per_character" // "Only available once per character"
        | "once_per_account"; // "Only available once per account"

      // Adds a "Not available this week" note
      availableWhen:
        | "activity_is_featured" // if not featured: "Activity is not featured: will not drop this week"
        | "activity_not_featured" // if featured: "Activity is featured: will not drop this week"
        | "always"; // no note
    };

export interface Encounter {
  name: string;
  description: string;
  backgroundImage: string;
  triumphs: Triumph[];
}

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
