// import {
//   getDestinyManifest,
//   getDestinyManifestSlice,
//   HttpClientConfig,
// } from "bungie-api-ts/destiny2";

import { BungieDamageTypes } from "../data/bungie-types";
import { Loot, LootPool } from "../data/types";
import { getDamageTypes, getInventoryItemLite, getSettings } from "./bungie";

// async function $http<Return>(config: HttpClientConfig): Promise<Return> {
//   // fill in the API key, handle OAuth, etc., then make an HTTP request using the config.
//   return fetch(config.url, {
//     headers: {
//       "X-API-Key": "",
//     },
//   });
// }

function getLootHashes(loot: Loot): [number[], number[]] {
  if (loot.type === "item") {
    return [[loot.itemHash], []];
  } else if (loot.type === "mod") {
    return [[], [loot.modHash]];
  } else if (loot.type === "group") {
    const items: number[] = [];
    const mods: number[] = [];

    for (const child of loot.children) {
      const [childItems, childMods] = getLootHashes(child);
      items.push(...childItems);
      mods.push(...childMods);
    }

    return [items, mods];
  } else {
    throw new Error("Invalid loot type");
  }
}

// item, mod
function findAllLootItems(pool: LootPool): [number[], number[]] {
  const items: number[] = [];
  const mods: number[] = [];

  if (pool.type === "mode_specific") {
    for (const mode of pool.modes) {
      for (const child of mode.children) {
        const [childItems, childMods] = findAllLootItems(child);
        items.push(...childItems);
        mods.push(...childMods);
      }
    }
    return [items, mods];
  } else if (pool.type === "pool") {
    for (const loot of pool.loot) {
      const [childItems, childMods] = getLootHashes(loot);
      items.push(...childItems);
      mods.push(...childMods);
    }
    return [items, mods];
  } else {
    throw new Error("Invalid pool type");
  }
}

export async function testBungieApi(pool: LootPool) {
  console.log("Testing Bungie API");

  const [items, mods] = findAllLootItems(pool);

  console.log(pool);
  console.log(items);
  console.log(mods);

  // Get Destiny info
  const settings = await getSettings();
  const inventoryItems = await getInventoryItemLite();
  const damageTypes = await getDamageTypes();
  console.log(damageTypes);

  const itemDefs = [...new Set(items)].map((itemHash) => inventoryItems[`${itemHash}`]);
  console.log(itemDefs);

  return [
    itemDefs.map((item) => ({
      name: item.displayProperties.name,
      icon: item.displayProperties.icon,
      type: item.itemTypeDisplayName,
      watermark: item.iconWatermark,
      damageType: item.defaultDamageType,
      ammoType: item.equippingBlock?.ammoType,
      quantity: item.displayProperties.name === "Spoils of Conquest" ? 5 : undefined,
    })),
    damageTypes,
  ] as [
    {
      name: string;
      icon?: string;
      type: string;
      watermark?: string;
      damageType: number;
      ammoType?: number;
      quantity?: number;
    }[],
    BungieDamageTypes,
  ];

  //   const destinyManifest = (await getDestinyManifest($http)).Response;
  //   const manifestTables = getDestinyManifestSlice($http, {
  //     destinyManifest,
  //     tableNames: ["DestinyInventoryItemDefinition"],
  //     language: "en",
  //   });

  //   console.log(manifestTables);
}
