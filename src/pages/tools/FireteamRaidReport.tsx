import {
  Box,
  Button,
  Group,
  Input,
  LoadingOverlay,
  NativeSelect,
  Stack,
  Title,
  Text,
  Table,
  Badge,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import {
  bungieGetMembershipTypes,
  bungieGetUserProfile,
  bungieSearchForUser,
  getRRProxyData,
  RRProxyResponse,
} from "../../utils/bungie-api/tool-queries";
import LootIcon from "../../components/loot/LootIcon";
import dayjs from "dayjs";
import { useGlobalData } from "../../data/useGlobalData";

interface ActivityStats {
  totalClears: number;
  fullClears: number;
  sherpas?: number;
  fastestFullClearSeconds?: number;
  bestFlawless?: number;
  bestLowman?: number;
}

interface BungieActivityData {
  normal?: ActivityStats;
  master?: ActivityStats;
}

interface TableRow {
  membershipId: string;
  username: string;
  emblemHash: number;
  activityHistory: Record<string, BungieActivityData>;
}

function nameOfLowman(type: string, count: number): string {
  return `${count === 3 ? "Trio " : count === 2 ? "Duo " : count === 1 ? "Solo " : ""}${type}`;
}

export default function FireteamRaidReport() {
  const { activities } = useGlobalData();
  const raids = activities.filter((activity) => activity.type === "raid");

  const [username, setUsername] = useLocalStorage({
    key: "fireteam-tool-username",
    defaultValue: "",
  });
  const [selectedRaid, setSelectedRaid] = useLocalStorage({
    key: "fireteam-tool-raid",
    defaultValue: "raid-salvations-edge",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TableRow[]>([]);

  async function handleLoad() {
    if (username.trim() === "") return;

    setLoading(true);
    setError("");

    try {
      const displayName = username.trim().split("#")[0];
      const displayNameCode = parseInt(username.trim().split("#")[1]);

      if (isNaN(displayNameCode)) {
        return setError("Invalid username format");
      }

      // User search query
      const userSearch = await bungieSearchForUser(displayName, displayNameCode);
      if (!userSearch) {
        return setError("Failed to find user.");
      }
      const { membershipType, membershipId } = userSearch;

      // Main user data query
      const mainUserProfile = await bungieGetUserProfile(membershipType, membershipId);
      if (!mainUserProfile) {
        return setError("Failed to find user data.");
      }

      // Extract fireteam data
      const fireteam = mainUserProfile.profileTransitoryData.data?.partyMembers ?? [
        {
          membershipId,
          emblemHash: Object.values(mainUserProfile.characters.data).sort((a, b) =>
            dayjs(b.dateLastPlayed).diff(dayjs(a.dateLastPlayed))
          )[0].emblemHash,
        },
      ];
      console.log(fireteam);

      // Query fireteam activity history
      const fireteamActivityHistory = await Promise.all(
        fireteam.map(async (member) => {
          const userProfile =
            member.membershipId === membershipId
              ? mainUserProfile
              : await bungieGetMembershipTypes(member.membershipId).then((res) =>
                  bungieGetUserProfile(
                    res?.destinyMemberships.find((m) => m.membershipId === res.primaryMembershipId)
                      ?.membershipType!,
                    member.membershipId
                  )
                );

          if (!userProfile) {
            setError("Failed to fetch some fireteam members.");
            return null;
          }

          //   const activityHistory: BungieActivityDefinition[] = [];

          //   let shouldContinue = false;
          //   let page = 0;
          //   do {
          //     shouldContinue = false;
          //     const userActivityHistory = await bungieGetUserActivityHistory(
          //       membershipType,
          //       userProfile?.profile.data.userInfo.membershipId,
          //       Object.keys(userProfile?.characters.data)[0] ?? "",
          //       250,
          //       "raid",
          //       page
          //     );
          //     if (userActivityHistory) {
          //       activityHistory.push(...userActivityHistory.activities);

          //       if (userActivityHistory.activities.length === 250) {
          //         ++page;
          //         shouldContinue = true;
          //       }
          //     }
          //   } while (shouldContinue);

          //   const activityData: Record<
          //     number,
          //     {
          //       totalClears: number;
          //       fullClears: number;
          //       fastestFullClearSeconds: number;
          //     }
          //   > = {};

          //   for (const activity of activityHistory) {
          //     const activityHash = activity.activityDetails.directorActivityHash;
          //     if (!activityData[activityHash]) {
          //       activityData[activityHash] = {
          //         totalClears: 0,
          //         fullClears: 0,
          //         fastestFullClearSeconds: Infinity,
          //       };
          //     }
          //   }

          const rrProxyData = await getRRProxyData(member.membershipId);

          function convert(proxyData: RRProxyResponse["activities"][number]): ActivityStats {
            return {
              totalClears: proxyData.values.clears,
              fullClears: proxyData.values.fullClears,
              sherpas: proxyData.values.sherpaCount,
              fastestFullClearSeconds: proxyData.values.fastestFullClear?.value,
              bestFlawless: proxyData.values.flawlessActivities
                ?.filter((a) => a.fresh)
                .sort((a, b) => a.accountCount - b.accountCount)[0]?.accountCount,
              bestLowman: proxyData.values.lowAccountCountActivities
                ?.filter((a) => a.fresh)
                .sort((a, b) => a.accountCount - b.accountCount)[0]?.accountCount,
            };
          }

          function aggregate(stats: ActivityStats[] | undefined): ActivityStats | undefined {
            if (!stats) return undefined;

            return stats.reduce(
              (acc, cur) => ({
                totalClears: acc.totalClears + cur.totalClears,
                fullClears: acc.fullClears + cur.fullClears,
                sherpas: (acc.sherpas ?? 0) + (cur.sherpas ?? 0),
                fastestFullClearSeconds: Math.min(
                  acc.fastestFullClearSeconds ?? Infinity,
                  cur.fastestFullClearSeconds ?? Infinity
                ),
                bestFlawless: Math.min(acc.bestFlawless ?? Infinity, cur.bestFlawless ?? Infinity),
                bestLowman: Math.min(acc.bestLowman ?? Infinity, cur.bestLowman ?? Infinity),
              }),
              {
                totalClears: 0,
                fullClears: 0,
                sherpas: 0,
                fastestFullClearSeconds: Infinity,
                bestFlawless: Infinity,
                bestLowman: Infinity,
              }
            );
          }

          const activityHistory: Record<string, BungieActivityData> = {};

          for (const raid of raids) {
            activityHistory[raid.id] = {
              normal: aggregate(
                rrProxyData?.activities
                  .filter((a) => raid.bungieActivityHashes?.includes(a.activityHash))
                  .map(convert)
              ),
              master: aggregate(
                rrProxyData?.activities
                  .filter((a) => raid.bungieMasterActivityHashes?.includes(a.activityHash))
                  .map(convert)
              ),
            };
          }

          return {
            ...member,
            emblemHash: Object.values(userProfile.characters.data).sort((a, b) =>
              dayjs(b.dateLastPlayed).diff(dayjs(a.dateLastPlayed))
            )[0].emblemHash,
            username: userProfile.profile.data.userInfo.bungieGlobalDisplayName,
            activityHistory,
          } as TableRow;
        })
      );

      setData(fireteamActivityHistory.filter((m) => !!m));
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="sm">
      <Title>Fireteam Raid Summary</Title>
      <Group maw={500}>
        <Box pos="relative" style={{ flexGrow: 1, flexBasis: 200 }}>
          <Input
            placeholder="DestinyUsername#1234"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleLoad()}
          />
          <LoadingOverlay visible={loading} loaderProps={{ size: "sm" }} />
        </Box>
        <NativeSelect
          data={raids.map((raid) => ({ value: raid.id, label: raid.name }))}
          value={selectedRaid}
          onChange={(event) => setSelectedRaid(event.currentTarget.value)}
          style={{ flexGrow: 1, flexBasis: 200 }}
        />
      </Group>
      <Box pos="relative" maw={500}>
        <Button onClick={handleLoad} fullWidth>
          <Group gap="xs">
            Search <ArrowRight weight="bold" />
          </Group>
        </Button>
        <LoadingOverlay visible={loading} loaderProps={{ size: "sm" }} />
      </Box>
      <Text c="red">{error}</Text>
      {data.length > 0 && (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Guardian</Table.Th>
              <Table.Th>Normal Clears</Table.Th>
              <Table.Th>Master Clears</Table.Th>
              <Table.Th>Sherpas</Table.Th>
              <Table.Th>Fastest Time</Table.Th>
              <Table.Th>Tags</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row) => (
              <Table.Tr key={row.membershipId}>
                <Table.Td p={0}>
                  <Group gap="xs" p={0}>
                    <LootIcon loot={{ type: "item", itemHash: row.emblemHash }} size={40} />
                    {row.username}
                  </Group>
                </Table.Td>
                <Table.Td>
                  {row.activityHistory[selectedRaid]?.normal?.totalClears
                    ? `${row.activityHistory[selectedRaid]?.normal?.totalClears} (${(
                        (row.activityHistory[selectedRaid]?.normal?.fullClears /
                          row.activityHistory[selectedRaid]?.normal?.totalClears) *
                        100
                      ).toFixed(0)}% full)`
                    : "N/A"}
                </Table.Td>
                <Table.Td>
                  {row.activityHistory[selectedRaid]?.master?.totalClears
                    ? `${row.activityHistory[selectedRaid]?.master?.totalClears} (${(
                        (row.activityHistory[selectedRaid]?.master?.fullClears /
                          row.activityHistory[selectedRaid]?.master?.totalClears) *
                        100
                      ).toFixed(0)}% full)`
                    : "N/A"}
                </Table.Td>
                <Table.Td>
                  {row.activityHistory[selectedRaid]?.normal?.totalClears ||
                  row.activityHistory[selectedRaid]?.master?.totalClears
                    ? (row.activityHistory[selectedRaid]?.normal?.sherpas ?? 0) +
                      (row.activityHistory[selectedRaid]?.master?.sherpas ?? 0)
                    : "N/A"}
                </Table.Td>
                <Table.Td>
                  {isFinite(
                    row.activityHistory[selectedRaid]?.normal?.fastestFullClearSeconds ?? Infinity
                  ) ||
                  isFinite(
                    row.activityHistory[selectedRaid]?.master?.fastestFullClearSeconds ?? Infinity
                  )
                    ? `${dayjs
                        .duration(
                          Math.min(
                            row.activityHistory[selectedRaid]?.normal?.fastestFullClearSeconds ??
                              Infinity,
                            row.activityHistory[selectedRaid]?.master?.fastestFullClearSeconds ??
                              Infinity
                          ),
                          "seconds"
                        )
                        .format("H[h] m[m] s[s]")}`
                    : "N/A"}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {(row.activityHistory[selectedRaid]?.normal?.bestFlawless ?? Infinity) <= 6 && (
                      <Badge radius="xs">
                        {nameOfLowman(
                          "Flawless",
                          row.activityHistory[selectedRaid]?.normal?.bestFlawless ?? Infinity
                        )}
                      </Badge>
                    )}
                    {(row.activityHistory[selectedRaid]?.normal?.bestLowman ?? Infinity) <= 3 &&
                      (row.activityHistory[selectedRaid]?.normal?.bestLowman ?? Infinity) <
                        (row.activityHistory[selectedRaid]?.normal?.bestFlawless ?? Infinity) && (
                        <Badge radius="xs">
                          {nameOfLowman(
                            "",
                            row.activityHistory[selectedRaid]?.normal?.bestLowman ?? Infinity
                          )}
                        </Badge>
                      )}
                    {(row.activityHistory[selectedRaid]?.master?.bestFlawless ?? Infinity) <= 6 && (
                      <Badge radius="xs">
                        {nameOfLowman(
                          "Flawless Master",
                          row.activityHistory[selectedRaid]?.master?.bestFlawless ?? Infinity
                        )}
                      </Badge>
                    )}
                    {(row.activityHistory[selectedRaid]?.master?.bestLowman ?? Infinity) <= 3 &&
                      (row.activityHistory[selectedRaid]?.master?.bestLowman ?? Infinity) <
                        (row.activityHistory[selectedRaid]?.master?.bestFlawless ?? Infinity) && (
                        <Badge radius="xs">
                          {nameOfLowman(
                            "Master",
                            row.activityHistory[selectedRaid]?.master?.bestLowman ?? Infinity
                          )}
                        </Badge>
                      )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}
