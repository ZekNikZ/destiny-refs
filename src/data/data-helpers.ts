import { Activity, SharedLootPools } from "./types";

function recurseAndApplyLootRefs(obj: any, sharedLoot: SharedLootPools): any {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      // Array: map over elements
      const res = [];
      for (const v of obj) {
        if (v.type === "ref-loot-set" && v.key) {
          res.push(
            ...recurseAndApplyLootRefs(
              sharedLoot.sets[v.key].map((ref) =>
                recurseAndApplyLootRefs({ ...v, ...ref }, sharedLoot)
              ),
              sharedLoot
            )
          );
        } else {
          res.push(recurseAndApplyLootRefs(v, sharedLoot));
        }
      }
      return res;
    } else {
      // Object: check values for loot ref
      if (obj.type === "ref-loot" && obj.key) {
        const ref = sharedLoot.loot[obj.key];
        if (ref) {
          return recurseAndApplyLootRefs({ ...obj, ...ref }, sharedLoot);
        } else {
          throw new Error(`Loot not found: ${obj.key}`);
        }
      } else if (obj.type === "ref-loot-pool" && obj.key) {
        const ref = sharedLoot.pools[obj.key];
        if (ref) {
          return recurseAndApplyLootRefs({ ...obj, ...ref }, sharedLoot);
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

export function applyLootRefs(json: Activity, sharedLoot: SharedLootPools): Activity {
  const activity: Activity = recurseAndApplyLootRefs(json, sharedLoot);
  return activity;
}
