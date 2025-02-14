import { Stack, Title, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useGlobalData } from "../../data/useGlobalData";
import { numberToOrdinal } from "../../utils/number-to-words";
import classes from "./RaidChallengeRotationDisplay.module.scss";

const DISPLAY_LENGTH_WEEKS = 10;
const RAID_ROTATION_ID = "raids";
const COMPUTATION_RAID_ID = "raid-deep-stone-crypt";

export default function RaidChallengeRotationDisplay() {
  const { activities, rotations } = useGlobalData();

  const raids = activities.filter((activity) => activity.type === "raid");

  const raidRotation = rotations.activityRotations.find(
    (rotation) => rotation.id === RAID_ROTATION_ID
  );

  const challengeRotations = Object.fromEntries(
    rotations.challengeRotations
      .map((rotation) => ({
        ...rotation,
        startIndex: dayjs().diff(dayjs(rotation.startDate), "week"),
      }))
      .map((rotation) => [rotation.parentActivityId, rotation])
  );

  const startDate = dayjs(challengeRotations[COMPUTATION_RAID_ID].startDate);
  const startIndex = challengeRotations[COMPUTATION_RAID_ID].startIndex;

  return (
    <Stack>
      <Title order={2} size="h2">
        Raid Challenges
      </Title>
      <Stack gap={0}>
        <Table
          striped
          stripedColor="#3b3b3b"
          highlightOnHover
          highlightOnHoverColor="#4b4b4b"
          withTableBorder
          withColumnBorders
          layout="fixed"
          ta="center"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={120} ta="center">
                Week
              </Table.Th>
              {raids.map((raid) => (
                <Table.Th
                  key={raid.id}
                  className={classes.darkOverlay}
                  ta="center"
                  style={{
                    backgroundImage: `url("${raid.backgroundImage}")`,
                    backgroundPosition: "50% 50%",
                    backgroundSize: "cover",
                  }}
                >
                  <Text fw="bold">{raid.abbreviation}</Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Array.from(Array(DISPLAY_LENGTH_WEEKS).keys()).map((index) => {
              const raidRotationIndex =
                raidRotation && raidRotation.type === "weekly"
                  ? dayjs().diff(dayjs(raidRotation.startDate), "week")
                  : -1;

              const raidsThisWeek =
                raidRotation && raidRotation.type === "weekly" && raidRotationIndex !== -1
                  ? raidRotation.rotation[
                      (raidRotationIndex + index) % raidRotation.rotation.length
                    ]
                  : [];

              return (
                <Table.Tr key={index}>
                  <Table.Th ta="center">
                    {startDate.add(index + startIndex, "weeks").format("MMMM D")}
                  </Table.Th>
                  {raids.map((raid) => (
                    <Table.Td
                      key={raid.id}
                      fw={raidsThisWeek.includes(raid.id) ? "bold" : undefined}
                      bg={raidsThisWeek.includes(raid.id) ? "gray.7" : undefined}
                    >
                      {raidsThisWeek.includes(raid.id)
                        ? "ALL"
                        : challengeRotations[raid.id]
                          ? numberToOrdinal(
                              ((challengeRotations[raid.id].startIndex + index) %
                                challengeRotations[raid.id].rotation.length) +
                                1
                            )
                          : "N/A"}
                    </Table.Td>
                  ))}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Stack>
    </Stack>
  );
}
