import {
  BungieDamageTypes,
  BungieInventoryItemLite,
  BungieManifest,
  BungieSettings,
} from "../data/bungie-types";

let manifest: BungieManifest | null = null;
export let settings: BungieSettings | null = null;

export async function getManifest(): Promise<BungieManifest> {
  const data = await (await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/")).json();

  manifest = {
    inventoryItemLite:
      data.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemLiteDefinition,
    damageType: data.Response.jsonWorldComponentContentPaths.en.DestinyDamageTypeDefinition,
  };

  return manifest;
}

export async function getSettings(): Promise<BungieSettings> {
  const data = await (await fetch("https://www.bungie.net/Platform/Settings/")).json();

  settings = {
    ammoIcons: {
      1: data.Response.destiny2CoreSettings.ammoTypePrimaryIcon,
      2: data.Response.destiny2CoreSettings.ammoTypeSpecialIcon,
      3: data.Response.destiny2CoreSettings.ammoTypeHeavyIcon,
    },
  };

  return settings;
}

export async function getInventoryItemLite(): Promise<BungieInventoryItemLite> {
  if (manifest === null) {
    await getManifest();
  }

  return (await fetch(`https://www.bungie.net/${manifest!.inventoryItemLite}`)).json();
}

export async function getDamageTypes(): Promise<BungieDamageTypes> {
  if (manifest === null) {
    await getManifest();
  }

  const data = await (await fetch(`https://www.bungie.net/${manifest!.damageType}`)).json();

  return Object.fromEntries(
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
  );
}
