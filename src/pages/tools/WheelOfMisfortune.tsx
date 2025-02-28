import {
  Box,
  Button,
  Group,
  Input,
  LoadingOverlay,
  Stack,
  Title,
  Text,
  Table,
  List,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ArrowRight } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { useState } from "react";
import {
  bungieSearchForUser,
  bungieGetUserProfile,
  bungieGetMembershipTypes,
} from "../../utils/bungie-api/tool-queries";
import LootIcon from "../../components/loot/LootIcon";

import DEFAULT_LIST_RAW from "./wheel-of-misfortune.json";

interface PunishmentEntry {
  text: string;
  weight?: number;
  extraSpins?: 2;
  tags?: string[];
  children?: PunishmentEntry[];
}

const DEFAULT_LIST = DEFAULT_LIST_RAW.options as PunishmentEntry[];
const WEIGHTED_DEFAULT_LIST: PunishmentEntry[] = DEFAULT_LIST.flatMap((entry) =>
  Array(entry.weight ?? 1).fill(entry)
);
const NO_EXTRA_SPIN_DEFAULT_LIST: PunishmentEntry[] = WEIGHTED_DEFAULT_LIST.filter(
  (entry) => !entry.extraSpins
);

type FireteamMember = (
  | { source: "manual"; username: string; membershipId?: undefined; emblemHash?: number }
  | {
      source: "fireteam";
      username: string;
      membershipId: string;
      emblemHash: number;
    }
) & { punishments?: PunishmentEntry[] };

export default function WheelOfMisfortune() {
  const [username, setUsername] = useLocalStorage({
    key: "fireteam-tool-username",
    defaultValue: "",
  });
  const [manualUser, setManualUser] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fireteamMembers, setFireteamMembers] = useState<FireteamMember[]>([]);

  function getRandomPunishment(
    otherOwnPunishments: PunishmentEntry[] = [],
    otherTeamPunishments: PunishmentEntry[] = []
  ): PunishmentEntry {
    // Determine blacklists
    const punishmentTextBlacklist = [
      ...flattenPunishments(otherOwnPunishments),
      ...flattenPunishments(otherTeamPunishments),
    ].map((item) => item.text);
    const punishmentTagBlacklist = [
      ...flattenPunishments(otherOwnPunishments),
      ...flattenPunishments(otherTeamPunishments).filter((item) => item.tags?.includes("team")),
    ].flatMap((item) => item.tags ?? []);

    // Randomize punishment
    let punishment: PunishmentEntry;
    let attempts = 0;
    do {
      if (attempts >= 10) {
        punishment = { text: "Nothing happens" };
        break;
      }
      punishment = {
        ...WEIGHTED_DEFAULT_LIST[Math.floor(Math.random() * WEIGHTED_DEFAULT_LIST.length)],
      };
      attempts++;
    } while (
      punishmentTextBlacklist.includes(punishment.text) ||
      punishmentTagBlacklist.some((tag) => punishment.tags?.includes(tag))
    );

    // If we got "Nothing happens", return early
    if (punishment.text === "Nothing happens") {
      return punishment;
    }

    // Adjust blacklists
    punishmentTextBlacklist.push(punishment.text);
    punishmentTagBlacklist.push(...(punishment.tags ?? []));

    // Get extra spins
    for (let j = 0; j < (punishment.extraSpins ?? 0); j++) {
      // Randomize punishment
      let extraPunishment: PunishmentEntry;
      attempts = 0;
      do {
        if (attempts >= 10) {
          extraPunishment = { text: "Nothing extra happens" };
          break;
        }
        extraPunishment = {
          ...NO_EXTRA_SPIN_DEFAULT_LIST[
            Math.floor(Math.random() * NO_EXTRA_SPIN_DEFAULT_LIST.length)
          ],
        };
        attempts++;
      } while (
        punishmentTextBlacklist.includes(extraPunishment.text) ||
        punishmentTagBlacklist.some((tag) => extraPunishment.tags?.includes(tag))
      );

      // Add the extra punishment to the main punishment
      if (!punishment.children) {
        punishment.children = [];
      }
      punishment.children.push(extraPunishment);

      // Adjust blacklists (only if we didn't get "Nothing extra happens")
      if (extraPunishment.text !== "Nothing extra happens") {
        punishmentTextBlacklist.push(extraPunishment.text);
        punishmentTagBlacklist.push(...(extraPunishment.tags ?? []));
      }
    }

    return punishment;
  }

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

          return {
            source: "fireteam",
            ...member,
            emblemHash: Object.values(userProfile.characters.data).sort((a, b) =>
              dayjs(b.dateLastPlayed).diff(dayjs(a.dateLastPlayed))
            )[0].emblemHash,
            username: userProfile.profile.data.userInfo.bungieGlobalDisplayName,
          } as FireteamMember;
        })
      );

      setFireteamMembers((fireteamMembers) => [
        ...fireteamMembers.filter((m) => m.source === "manual"),
        ...fireteamActivityHistory.filter((m) => !!m),
      ]);
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }

  function addManualUser() {
    if (manualUser.trim() === "") return;

    setLoading(true);

    setFireteamMembers((members) => [
      ...members,
      { source: "manual", username: manualUser.trim() },
    ]);
    setManualUser("");

    setLoading(false);
  }

  function clearFireteam() {
    setFireteamMembers([]);
  }

  function removeFireteamMember(member: FireteamMember) {
    setFireteamMembers((members) => members.filter((m) => m !== member));
  }

  function flattenPunishments(punishments: PunishmentEntry[]): PunishmentEntry[] {
    return punishments.flatMap((punishment) => [
      punishment,
      ...(punishment.children ? flattenPunishments(punishment.children) : []),
    ]);
  }

  function rerollFireteam() {
    const teamPunishmentsSoFar: PunishmentEntry[] = [];
    for (const member of fireteamMembers) {
      // Get the new punishment
      const punishment = getRandomPunishment([], teamPunishmentsSoFar);

      teamPunishmentsSoFar.push(punishment);

      // Add the punishment to the member
      setFireteamMembers((members) =>
        members.map((m) => (m === member ? { ...m, punishments: [punishment] } : m))
      );
    }
  }

  function rerollFireteamMember(member: FireteamMember) {
    // Get the new punishment
    const punishment = getRandomPunishment(
      [],
      fireteamMembers.flatMap((m) => m.punishments ?? [])
    );

    // Add the punishment to the member
    setFireteamMembers((members) =>
      members.map((m) => (m === member ? { ...m, punishments: [punishment] } : m))
    );
  }

  function addPunishmentToFireteamMember(member: FireteamMember) {
    // Get the new punishment
    const punishment = getRandomPunishment(
      member.punishments ?? [],
      fireteamMembers.flatMap((m) => m.punishments ?? [])
    );

    // Add the punishment to the member
    setFireteamMembers((members) =>
      members.map((m) =>
        m === member ? { ...m, punishments: [...(m.punishments ?? []), punishment] } : m
      )
    );
  }

  return (
    <Stack gap="sm">
      <Title>Wheel of Misfortune</Title>
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
        <Button
          onClick={handleLoad}
          style={{ flexGrow: 1, flexBasis: 150 }}
          disabled={username.trim().length === 0}
        >
          <Group gap="xs">
            Add In-Game Fireteam <ArrowRight weight="bold" />
          </Group>
        </Button>
      </Group>
      {error && <Text c="red">{error}</Text>}
      <Group maw={500}>
        <Box pos="relative" style={{ flexGrow: 1, flexBasis: 200 }}>
          <Input
            placeholder="Username"
            value={manualUser}
            onChange={(event) => setManualUser(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addManualUser()}
          />
          <LoadingOverlay visible={loading} loaderProps={{ size: "sm" }} />
        </Box>
        <Button
          onClick={addManualUser}
          style={{ flexGrow: 1, flexBasis: 150 }}
          disabled={manualUser.trim().length === 0}
        >
          <Group gap="xs">
            Add to Fireteam <ArrowRight weight="bold" />
          </Group>
        </Button>
      </Group>
      <Group wrap="wrap" gap="sm">
        <Button onClick={clearFireteam} disabled={fireteamMembers.length === 0} color="red">
          Clear Fireteam
        </Button>
        <Button onClick={rerollFireteam} disabled={fireteamMembers.length === 0} color="green">
          Reroll All Punishments
        </Button>
      </Group>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={300}>Fireteam Member</Table.Th>
            <Table.Th>Punishment(s)</Table.Th>
            <Table.Th w={300}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {fireteamMembers.map((member) => (
            <Table.Tr key={`${member.membershipId}-${member.username}`}>
              <Table.Td p={0}>
                <Group gap="xs" p={0}>
                  {member.emblemHash ? (
                    <LootIcon loot={{ type: "item", itemHash: member.emblemHash }} size={40} />
                  ) : (
                    <Box w={40} h={40} />
                  )}
                  {member.username}
                </Group>
              </Table.Td>
              <Table.Td>
                <Stack gap={0}>
                  {member.punishments?.map((punishment) => (
                    <>
                      <Text>{punishment.text}</Text>
                      {punishment.children && punishment.children.length > 0 && (
                        <List>
                          {punishment.children.map((child) => (
                            <List.Item key={child.text}>{child.text}</List.Item>
                          ))}
                        </List>
                      )}
                    </>
                  ))}
                </Stack>
              </Table.Td>
              <Table.Td>
                <Group>
                  <Button
                    variant="subtle"
                    onClick={() => addPunishmentToFireteamMember(member)}
                    color="green"
                  >
                    Add
                  </Button>
                  <Button variant="subtle" onClick={() => rerollFireteamMember(member)}>
                    Reroll
                  </Button>
                  <Button variant="subtle" color="red" onClick={() => removeFireteamMember(member)}>
                    Remove
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
