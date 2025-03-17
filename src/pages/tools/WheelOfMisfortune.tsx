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

import { WOMFireteamMember } from "../../data/wom/wom-types";
import { useWOMData } from "../../data/wom/useWOMData";
import PunishmentSelectorModal from "../../components/wom/PunishmentListSelectorModal";
import EditPunishmentListModal from "../../components/wom/EditPunishmentListModal";

// TODO: Copy for discord button

export default function WheelOfMisfortune() {
  const [username, setUsername] = useLocalStorage({
    key: "fireteam-tool-username",
    defaultValue: "",
  });
  const [manualUser, setManualUser] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fireteamMembers = useWOMData((state) => state.members);
  const addFireteamMember = useWOMData((state) => state.addFireteamMember);
  const removeFireteamMember = useWOMData((state) => state.removeFireteamMember);
  const clearFireteam = useWOMData((state) => state.clearFireteam);
  const rerollWOMFireteamMember = useWOMData((state) => state.rerollFireteamMember);
  const addPunishmentToWOMFireteamMember = useWOMData(
    (state) => state.addPunishmentToFireteamMember
  );
  const rerollAllFireteamMembers = useWOMData((state) => state.rerollAllFireteamMembers);
  const openListModal = useWOMData((state) => state.openListModal);
  const undo = useWOMData((state) => state.undo);

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
      const fireteamActivityHistory = await Promise.all<WOMFireteamMember | null>(
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
            punishments: [],
          };
        })
      );

      for (const member of fireteamActivityHistory) {
        if (!member) continue;

        addFireteamMember(member);
      }
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }

  function addManualUser() {
    if (manualUser.trim() === "") return;

    setLoading(true);

    addFireteamMember({
      source: "manual",
      username: manualUser.trim(),
      punishments: [],
    });
    setManualUser("");

    setLoading(false);
  }

  function copyMarkdown() {
    // Generate markdown in this format:
    // ```
    // Username:
    //  > Punishment
    //     > Child Punishment
    //  > Punishment
    // Username:
    //  ...

    const markdown = `\`\`\`
${fireteamMembers
  .map((member) => {
    const punishments = member.punishments.map((punishment) => {
      const children = punishment.children?.map((child) => `    > ${child.text}`).join("\n");
      return `  > ${punishment.text}${children ? `\n${children}` : ""}`;
    });

    return `${member.username}:\n${punishments.join("\n")}`;
  })
  .join("\n")}\`\`\``;

    navigator.clipboard.writeText(markdown);
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
        <Button
          onClick={rerollAllFireteamMembers}
          disabled={fireteamMembers.length === 0}
          color="green"
        >
          Reroll All Punishments
        </Button>
        <Button onClick={openListModal}>Settings</Button>
        <Button onClick={copyMarkdown}>Copy Markdown</Button>
        <Button onClick={undo} color="orange">
          Undo
        </Button>
      </Group>
      <Table striped withTableBorder>
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
                    onClick={() => addPunishmentToWOMFireteamMember(member.username)}
                    color="green"
                  >
                    Add
                  </Button>
                  <Button variant="subtle" onClick={() => rerollWOMFireteamMember(member.username)}>
                    Reroll
                  </Button>
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={() => removeFireteamMember(member.username)}
                  >
                    Remove
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <PunishmentSelectorModal />
      <EditPunishmentListModal />
    </Stack>
  );
}
