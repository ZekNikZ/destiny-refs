import { Loot, LootPool } from "../data/types";

export function summarizeLootPool(pool: LootPool): Loot[] {
  let loot: Loot[];

  switch (pool.type) {
    case "mode_specific":
      loot = pool.modes.flatMap((mode) => mode.children.flatMap(summarizeLootPool));
      break;
    case "pool":
      loot = pool.showInLootSummary ? pool.loot : [];
      break;
  }

  return loot.filter(
    (item, index) =>
      loot.findIndex((otherItem) => {
        if (item.type === "item" && otherItem.type === "item") {
          return item.itemHash === otherItem.itemHash;
        } else if (item.type === "group" && otherItem.type === "group") {
          return item.name === otherItem.name;
        } else {
          return false;
        }
      }) === index
  );
}
