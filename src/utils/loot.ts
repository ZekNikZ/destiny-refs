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

export function anyLootIsPinnacle(pools: LootPool[], activityIsFeatured?: boolean): boolean {
  return pools.some((pool) => {
    switch (pool.type) {
      case "mode_specific":
        return pool.modes.some((mode) =>
          mode.children.some((child) => anyLootIsPinnacle([child], activityIsFeatured))
        );
      case "pool":
        return (
          pool.pinnacleWhen === "always" ||
          (activityIsFeatured && pool.pinnacleWhen === "activity_is_featured")
        );
    }
  });
}
