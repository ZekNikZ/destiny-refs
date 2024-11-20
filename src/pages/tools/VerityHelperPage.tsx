import { Box, Button, Group, Input, LoadingOverlay, Stack, Switch, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import {
  bungieGetMembershipTypes,
  bungieGetUserProfile,
  bungieSearchForUser,
} from "../../utils/bungie-api/tool-queries";
import dayjs from "dayjs";
import LootIcon from "../../components/loot/LootIcon";

interface PlayerData {
  membershipId: string;
  username: string;
  class: number;
  equipment: number[];
  equipmentWithOrnaments: number[];
}

const armorBucketHashes = [
  4023194814, // Ghost Shell
  3448274439, // Helmet
  3551918588, // Gauntlets
  14239492, // Chest Armor
  20886954, // Leg Armor
  1585787867, // Class Armor
];

export default function VerityHelperPage() {
  const [username, setUsername] = useLocalStorage({
    key: "verity-tool-username",
    defaultValue: "",
  });
  const [showOrnaments, setShowOrnaments] = useLocalStorage({
    key: "verity-tool-show-ornaments",
    defaultValue: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PlayerData[]>([]);

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

          const currentCharacter = Object.values(userProfile.characters.data).sort((a, b) =>
            dayjs(b.dateLastPlayed).diff(dayjs(a.dateLastPlayed))
          )[0];

          const equipment = armorBucketHashes.map(
            (bucketHash) =>
              userProfile.characterEquipment.data[currentCharacter.characterId].items.find(
                (item) => item.bucketHash === bucketHash
              )?.itemHash ?? 0
          );

          const equipmentWithOrnaments = armorBucketHashes.map((bucketHash) => {
            const item = userProfile.characterEquipment.data[
              currentCharacter.characterId
            ].items.find((item) => item.bucketHash === bucketHash);
            return item?.overrideStyleItemHash ?? item?.itemHash ?? 0;
          });

          return {
            ...member,
            equipment,
            equipmentWithOrnaments,
            username: userProfile.profile.data.userInfo.bungieGlobalDisplayName,
            class: currentCharacter.classType,
          } as PlayerData;
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
      <Group maw={500}>
        <Box pos="relative" style={{ flexGrow: 1, flexBasis: "200px" }}>
          <Input
            placeholder="DestinyUsername#1234"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleLoad()}
          />
          <LoadingOverlay visible={loading} loaderProps={{ size: "sm" }} />
        </Box>
        <Box pos="relative" style={{ flexGrow: 1, flexBasis: "200px" }}>
          <LoadingOverlay visible={loading} loaderProps={{ size: "sm" }} />
          <Button onClick={handleLoad} fullWidth>
            <Group gap="xs">
              Search <ArrowRight weight="bold" />
            </Group>
          </Button>
        </Box>
      </Group>
      <Switch
        label="Show ornaments"
        checked={showOrnaments}
        onChange={(event) => setShowOrnaments(event.target.checked)}
      />
      <Text c="red">{error}</Text>
      {data.length > 0 && (
        <Group wrap="nowrap">
          {Object.entries(Object.groupBy(data, (player) => player.class))
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([classType, players]) => (
              <Stack align="center">
                <Text
                  ta="center"
                  fw="bold"
                  style={{ borderBottom: "1px solid rgb(201, 201, 201)", width: "100%" }}
                >
                  {classType === "1" ? "Hunter" : classType === "2" ? "Warlock" : "Titan"}
                </Text>
                <Group wrap="nowrap">
                  {(players ?? []).map((player) => (
                    <Stack gap="xs" key={player.membershipId} align="center">
                      <Text size="lg">{player.username}</Text>
                      {(showOrnaments ? player.equipmentWithOrnaments : player.equipment).map(
                        (itemHash) => (
                          <LootIcon key={itemHash} loot={{ type: "item", itemHash }} />
                        )
                      )}
                    </Stack>
                  ))}
                </Group>
              </Stack>
            ))}
        </Group>
      )}
    </Stack>
  );
}
