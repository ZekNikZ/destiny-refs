import { useBungieQuery } from "./helpers";

export interface BungieSettings {
  ammoIcons: {
    [key: number]: string;
  };
}

export function useBungieSettings() {
  return useBungieQuery<BungieSettings>("/Platform/Settings", {
    select: (data: any) => ({
      ammoIcons: {
        1: data.Response.destiny2CoreSettings.ammoTypePrimaryIcon,
        2: data.Response.destiny2CoreSettings.ammoTypeSpecialIcon,
        3: data.Response.destiny2CoreSettings.ammoTypeHeavyIcon,
      },
    }),
  });
}
