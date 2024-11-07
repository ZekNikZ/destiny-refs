import { useBungieQueryViaManifest } from "./helpers";

export interface BungieInventoryItemLiteDefinition {
  [key: `${number}`]: {
    displayProperties: {
      name: string;
      description: string;
      icon?: string;
      hasIcon: boolean;
    };
    equippingBlock?: {
      ammoType: number;
    };
    itemTypeDisplayName: string;
    iconWatermark: string;
    defaultDamageType: number;
    classType?: number;
  };
}

export function useBungieInventoryItemLite() {
  return useBungieQueryViaManifest<BungieInventoryItemLiteDefinition>(
    "DestinyInventoryItemLiteDefinition"
  );
}
