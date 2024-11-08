import { Activity, JsonData, SharedLootPools } from "./types";

function recurseAndApplyLootRefs(obj: any, sharedLoot: SharedLootPools): any {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      // Array: map over elements
      return obj.map((v) => recurseAndApplyLootRefs(v, sharedLoot));
    } else {
      // Object: check values for loot ref
      if (obj.type === "ref-loot" && obj.key) {
        const ref = sharedLoot.loot?.[obj.key];
        if (ref) {
          return ref;
        } else {
          throw new Error(`Loot not found: ${obj.key}`);
        }
      } else if (obj.type === "ref-loot-pool" && obj.key) {
        const ref = sharedLoot.pools?.[obj.key];
        if (ref) {
          return ref;
        } else {
          throw new Error(`Loot pool not found: ${obj.key}`);
        }
      } else {
        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
          newObj[key] = recurseAndApplyLootRefs(value, sharedLoot);
        }
        return newObj;
      }
    }
  } else {
    return obj;
  }
}

export function buildRealData(json: any): JsonData {
  const activities: Activity[] = recurseAndApplyLootRefs(json.activities, json.sharedLoot);

  return {
    activities,
    sharedLoot: json.sharedLoot,
  };
}