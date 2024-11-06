import { useBungieInventoryItemLite } from "./inventory-item-lite";

export function useBungieItemDetails(itemHash: number) {
  const result = useBungieInventoryItemLite();
  return { ...result, data: result.data?.[`${itemHash}`] };
}
