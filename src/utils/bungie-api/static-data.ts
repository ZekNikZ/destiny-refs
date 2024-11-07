import { useBungieQueryViaManifest } from "./helpers";
import { useMemo } from "react";

export interface BungieStaticData {
  damageTypes: {
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
  };
  classes: {
    [key: number]: {
      name: string;
      icon: string;
    };
  };
}

export function useBungieStaticData() {
  // Damage Types
  const { data: damageTypes, isSuccess: damageTypesSuccess } = useBungieQueryViaManifest<
    BungieStaticData["damageTypes"]
  >("DestinyDamageTypeDefinition", {
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

  const { data: classes, isSuccess: classesSuccess } = useBungieQueryViaManifest<
    BungieStaticData["classes"]
  >("DestinyClassDefinition", {
    select: (data: any) =>
      Object.fromEntries(
        Object.entries(data).map(([_, type]: any) => [
          type.classType,
          {
            name: type.displayProperties.name,
            icon: `/icons/class/${type.displayProperties.name.toLowerCase()}.svg`,
          },
        ])
      ),
  });

  return useMemo(() => {
    if (damageTypesSuccess && classesSuccess) {
      const data: BungieStaticData = { damageTypes, classes };
      return {
        data,
        isSuccess: true,
      };
    } else {
      return {
        data: undefined,
        isSuccess: false,
      };
    }
  }, [damageTypes, damageTypesSuccess]);
}
