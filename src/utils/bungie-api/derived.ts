import { useBungieInventoryItemLite } from "./inventory-item-lite";
import { useBungieRecord } from "./record";

export function useBungieItemDetails(itemHash: number) {
  const result = useBungieInventoryItemLite();
  return { ...result, data: result.data?.[`${itemHash}`] };
}

export function useBungieRecordDetails(recordHash: number) {
  const result = useBungieRecord();
  return { ...result, data: result.data?.[`${recordHash}`] };
}
