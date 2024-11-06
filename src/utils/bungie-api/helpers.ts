import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { BungieManifest, useBungieManifest } from "./manifest";

export function useBungieQuery<T>(
  url: string | undefined,
  options?: Omit<UseQueryOptions<T>, "queryKey">,
  manifestVersion?: string
) {
  return useQuery<T, Error, T, QueryKey>({
    queryKey: [`https://bungie.net/${url}`, manifestVersion],
    staleTime: 1000 * 60 * 60 * 24,
    ...options,
  });
}

export function useBungieQueryViaManifest<T>(
  manifestKey: keyof BungieManifest["Response"]["jsonWorldComponentContentPaths"]["en"],
  options?: Omit<UseQueryOptions<T>, "queryKey">
) {
  const { data: manifest } = useBungieManifest();

  return useBungieQuery(manifest?.Response.jsonWorldComponentContentPaths.en[manifestKey], {
    enabled: !!manifest,
    ...options,
  });
}
