// import {
//   getDestinyManifest,
//   getDestinyManifestSlice,
//   HttpClientConfig,
// } from "bungie-api-ts/destiny2";

// async function $http<Return>(config: HttpClientConfig): Promise<Return> {
//   // fill in the API key, handle OAuth, etc., then make an HTTP request using the config.
//   return fetch(config.url, {
//     headers: {
//       "X-API-Key": "",
//     },
//   });
// }

export async function testBungieApi() {
  console.log("Testing Bungie API");

  //   const destinyManifest = (await getDestinyManifest($http)).Response;
  //   const manifestTables = getDestinyManifestSlice($http, {
  //     destinyManifest,
  //     tableNames: ["DestinyInventoryItemDefinition"],
  //     language: "en",
  //   });

  //   console.log(manifestTables);
}
