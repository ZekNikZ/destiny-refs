import { Loot, LootPool } from "../data/types";

function flattenLootEntryIntoItemHashes(loot: Loot): number[] {
  if (loot.type === "item") {
    return [loot.itemHash];
  } else if (loot.type === "group") {
    return loot.children.flatMap(flattenLootEntryIntoItemHashes);
  } else {
    throw new Error("Invalid loot type");
  }
}

export function flattenLootPoolIntoItemHashes(pool: LootPool): number[] {
  if (pool.type === "mode_specific") {
    return pool.modes.flatMap((mode) => mode.children.flatMap(flattenLootPoolIntoItemHashes));
  } else if (pool.type === "pool") {
    return pool.loot.flatMap(flattenLootEntryIntoItemHashes);
  } else {
    throw new Error("Invalid pool type");
  }
}
