export interface BungieManifest {
  inventoryItemLite: string;
  damageType: string;
}

export interface BungieSettings {
  ammoIcons: {
    [key: number]: string;
  };
}

export interface BungieInventoryItemLite {
  [key: `${number}`]: {
    displayProperties: {
      name: string;
      description: string;
      icon?: string;
      hasIcon: boolean;
    };
    equippingBlock: {
      ammoType: number;
    };
    itemTypeDisplayName: string;
    iconWatermark: string;
    defaultDamageType: number;
  };
}

export interface BungieDamageTypes {
  [key: number]: {
    name: string;
    icon: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  };
}
