import { useBungieInventoryItemLite } from "./inventory-item-lite";
import { useBungiePresentationNode } from "./presentation-node";
import { useBungieRecord } from "./record";

export function useBungieItemDetails(itemHash: number) {
  const result = useBungieInventoryItemLite();
  return { ...result, data: result.data?.[`${itemHash}`] };
}

export function useBungieRecordDetails(recordHash: number) {
  const result = useBungieRecord();
  return { ...result, data: result.data?.[`${recordHash}`] };
}

export function useBungiePresentationNodeIcon(hash: number) {
  const result = useBungiePresentationNode();
  return { ...result, data: result.data?.[`${hash}`].displayProperties.icon };
}
