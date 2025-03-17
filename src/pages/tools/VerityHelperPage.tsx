import { Box, Button, Group, Input, LoadingOverlay, Stack, Switch, Text } from "@mantine/core";
import { useClipboard, useInterval, useLocalStorage } from "@mantine/hooks";
import { ArrowRight, Check, Copy } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  bungieGetMembershipTypes,
  bungieGetUserProfile,
  bungieSearchForUser,
} from "../../utils/bungie-api/tool-queries";
import dayjs from "dayjs";
import LootIcon from "../../components/loot/LootIcon";
import { useAsideComponentContext } from "../../components/AsideComponentContext";
import VerityCalculator from "../page-components/VerityCalculator";
import React from "react";
import { useSearchParams } from "react-router-dom";

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
  const { setAsideComponent } = useAsideComponentContext();

  const [username, setUsername] = useLocalStorage({
    key: "verity-tool-username",
    defaultValue: "",
  });
  const [showOrnaments, setShowOrnaments] = useLocalStorage({
    key: "verity-tool-show-ornaments",
    defaultValue: true,
  });
  const [showCalculator, setShowCalculator] = useLocalStorage({
    key: "verity-tool-show-calculator",
    defaultValue: false,
  });
  const [autoRefresh, setAutoRefresh] = useLocalStorage({
    key: "verity-tool-auto-refresh",
    defaultValue: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PlayerData[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const clipboard = useClipboard({ timeout: 2000 });

  useEffect(() => {
    if (searchParams.has("username")) {
      const usernameToLoad = searchParams.get("username")!;
      setUsername(usernameToLoad);
      handleLoad(usernameToLoad);
    }
  }, []);

  useEffect(() => {
    if (showCalculator) {
      setAsideComponent(<VerityCalculator />);
    }

    return () => {
      setAsideComponent(undefined);
    };
  }, [showCalculator]);

  useInterval(
    () => {
      if (autoRefresh && username) {
        handleLoad();
      }
    },
    60000,
    { autoInvoke: true }
  );

  async function handleLoad(usernameToLoadRaw?: string) {
    const usernameToLoad = usernameToLoadRaw ? usernameToLoadRaw.trim() : username.trim();

    if (usernameToLoad === "") return;

    setLoading(true);
    setError("");

    try {
      const displayName = usernameToLoad.split("#")[0];
      const displayNameCode = parseInt(usernameToLoad.split("#")[1]);

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

  function handleCopy() {
    setSearchParams({ username });
    clipboard.copy(window.location.href);
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
          <Button onClick={() => handleLoad()} fullWidth>
            <Group gap="xs">
              Search <ArrowRight weight="bold" />
            </Group>
          </Button>
        </Box>
      </Group>
      <Group>
        <Switch
          label="Show ornaments"
          checked={showOrnaments}
          onChange={(event) => setShowOrnaments(event.target.checked)}
        />
        <Switch
          label="Auto refresh (60 secs)"
          checked={autoRefresh}
          onChange={(event) => setAutoRefresh(event.target.checked)}
        />
        <Switch
          label="Show calculator (TBA)"
          checked={showCalculator}
          disabled
          onChange={(event) => setShowCalculator(event.target.checked)}
        />
        <Button onClick={handleCopy} size="xs" color={clipboard.copied ? "green" : "teal"}>
          <Group gap="xs">
            {clipboard.copied ? (
              <>
                Copied! <Check weight="bold" />
              </>
            ) : (
              <>
                Copy Link <Copy weight="bold" />
              </>
            )}
          </Group>
        </Button>
      </Group>
      <Text c="red">{error}</Text>
      {data.length > 0 && (
        <Group wrap="nowrap" style={{ overflow: "auto" }} gap="60px">
          {Object.entries(Object.groupBy(data, (player) => player.class))
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([classType, players]) => (
              <Stack align="center" key={classType}>
                <Text
                  ta="center"
                  fw="bold"
                  fz={22}
                  style={{ borderBottom: "1px solid rgb(201, 201, 201)", width: "100%" }}
                >
                  {classType === "1" ? "Hunter" : classType === "2" ? "Warlock" : "Titan"}
                </Text>
                <Group gap="40px">
                  {(players ?? []).map((player) => (
                    <Stack gap="sm" key={player.membershipId} align="center">
                      <Text size="lg" ta="center" w="100%">
                        {player.username}
                      </Text>
                      {(showOrnaments ? player.equipmentWithOrnaments : player.equipment).map(
                        (itemHash, index) => (
                          <React.Fragment key={itemHash}>
                            <LootIcon loot={{ type: "item", itemHash }} size={90} />
                            {index === 0 && <Box h={0} />}
                          </React.Fragment>
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
