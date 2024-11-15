export interface BungieUserSearchResult {
  membershipId: string;
  membershipType: number;
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number;
}

export async function bungieSearchForUser(
  displayName: string,
  displayNameCode: number
): Promise<BungieUserSearchResult | null> {
  const response = await fetch(
    `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayerByBungieName/-1`,
    {
      method: "POST",
      body: JSON.stringify({
        displayName,
        displayNameCode,
      }),
      headers: {
        "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY ?? "",
      },
    }
  );
  if (!response.ok) {
    return null;
  }

  return (await response.json()).Response[0];
}

export interface BungieMembershipSearchResult {
  primaryMembershipId: string;
  destinyMemberships: {
    membershipId: string;
    membershipType: number;
  }[];
}

export async function bungieGetMembershipTypes(
  membershipId: number | string
): Promise<BungieMembershipSearchResult | null> {
  const response = await fetch(
    `https://www.bungie.net/Platform/User/GetMembershipsById/${membershipId}/-1`,
    {
      headers: {
        "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY ?? "",
      },
    }
  );
  if (!response.ok) {
    return null;
  }

  const res: BungieMembershipSearchResult = (await response.json()).Response;

  if (res.destinyMemberships.length === 1) {
    res.primaryMembershipId = res.destinyMemberships[0].membershipId;
  }

  return res;
}

export interface BungieUserProfile {
  profile: {
    data: {
      userInfo: {
        membershipType: number;
        membershipId: string;
        bungieGlobalDisplayName: string;
        bungieGlobalDisplayNameCode: number;
      };
    };
  };
  profileTransitoryData: {
    data?: {
      partyMembers?: {
        membershipId: string;
        emblemHash: number;
      }[];
    };
  };
  characters: {
    data: {
      [key: string]: {
        membershipId: string;
        membershipType: number;
        characterId: string;
        dateLastPlayed: string;
        emblemHash: number;
      };
    };
  };
}

export async function bungieGetUserProfile(
  membershipType: number,
  membershipId: string
): Promise<BungieUserProfile | null> {
  const response = await fetch(
    `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=100,200,204,205,1000,305`,
    {
      headers: {
        "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY ?? "",
      },
    }
  );
  if (!response.ok) {
    return null;
  }
  return (await response.json()).Response;
}

export interface BungieActivityDefinition {
  activityDetails: {
    referenceId: number;
    directorActivityHash: number;
    instanceId: string;
    mode: number;
    modes: number[];
    isPrivate: boolean;
    membershipType: number;
  };
  values: {
    [key: string]: {
      statId: string;
      basic: {
        value: number;
        displayValue: string;
      };
    };
  };
}

export interface BungieActivityHistory {
  activities: BungieActivityDefinition[];
}

export async function bungieGetUserActivityHistory(
  membershipType: number,
  membershipId: string,
  characterId: string,
  count: number,
  modes: string,
  page: number
): Promise<BungieActivityHistory | null> {
  const response = await fetch(
    `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/?count=${count}&page=${page}&mode=${modes}`,
    {
      headers: {
        "X-API-Key": import.meta.env.VITE_BUNGIE_API_KEY ?? "",
      },
    }
  );
  if (!response.ok) {
    return null;
  }
  return (await response.json()).Response;
}

export interface RRProxyActivity {
  activityHash: number;
  values: {
    clears: number;
    fullClears: number;
    sherpaCount: number;
    firstClear?: {
      instanceId: string;
      period: string;
      duration: number;
    };
    fastestFullClear?: {
      instanceId: string;
      value: number;
    };
    flawlessDetails?: {
      instanceId: string;
      accountCount: number;
      fresh: boolean;
    };
    flawlessActivities?: {
      instanceId: string;
      accountCount: number;
      fresh: boolean;
    }[];
    bestPlayerCountDetails?: {
      accountCount: number;
      activePlayerCount: number;
      instanceId: string;
      startingPhaseIndex: number;
      fresh: boolean;
    };
    lowAccountCountActivities?: {
      accountCount: number;
      instanceId: string;
      startingPhaseIndex: number;
      fresh: boolean;
    }[];
  };
}

export interface RRProxyResponse {
  membershipId: string;
  activities: RRProxyActivity[];
}

export async function getRRProxyData(membershipId: string): Promise<RRProxyResponse | null> {
  const response = await fetch(
    `https://rr-proxy.destinyrefs.com/rr-proxy?membershipId=${membershipId}`
  );

  if (!response.ok) {
    return null;
  }
  return (await response.json()).response;
}
