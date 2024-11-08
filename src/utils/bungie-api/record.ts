import { useBungieQueryViaManifest } from "./helpers";

export interface BungieRecordDefinition {
  [key: `${number}`]: {
    displayProperties: {
      name: string;
      description: string;
      icon?: string;
      hasIcon: boolean;
    };
    rewardItems: {
      itemHash: number;
      quantity: number;
    }[];
  };
}

export function useBungieRecord() {
  return useBungieQueryViaManifest<BungieRecordDefinition>("DestinyRecordDefinition");
}
