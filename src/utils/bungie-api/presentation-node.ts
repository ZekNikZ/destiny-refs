import { useBungieQueryViaManifest } from "./helpers";

export interface BungiePresentationNodeDefinition {
  [key: `${number}`]: {
    displayProperties: {
      name: string;
      description: string;
      icon?: string;
      hasIcon: boolean;
    };
  };
}

export function useBungiePresentationNode() {
  return useBungieQueryViaManifest<BungiePresentationNodeDefinition>(
    "DestinyPresentationNodeDefinition"
  );
}
