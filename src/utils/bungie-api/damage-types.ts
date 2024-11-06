import { useBungieQueryViaManifest } from "./helpers";

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

export function useBungieDamageTypes() {
  return useBungieQueryViaManifest<BungieDamageTypes>("DestinyDamageTypeDefinition", {
    select: (data: any) =>
      Object.fromEntries(
        Object.entries(data).map(([_, type]: any) => [
          type.enumValue,
          {
            name: type.displayProperties.name,
            icon: type.displayProperties.icon,
            color: type.color
              ? {
                  r: type.color.red,
                  g: type.color.green,
                  b: type.color.blue,
                  a: type.color.alpha,
                }
              : undefined,
          },
        ])
      ),
  });
}
