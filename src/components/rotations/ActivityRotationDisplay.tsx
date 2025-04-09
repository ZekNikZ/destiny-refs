import { Box, Stack, Title, Text } from "@mantine/core";
import { ActivityRotation } from "../../data/types";
import RotationEntry from "./RotationEntry";
import dayjs from "dayjs";
import { rotateArray } from "../../utils/arrays";
import { isBetween } from "../../utils/dates";
import { activityTypes } from "../../routes";

interface Props {
  rotation: ActivityRotation;
}

export default function ActivityRotationDisplay(props: Props) {
  //   const noLinks = !!activityTypes.find((type) => type.type === props.rotation.activityType)
  //     ?.disableLinks;

  switch (props.rotation.type) {
    case "weekly":
    case "daily":
      const startDate = dayjs(props.rotation.startDate);
      const startIndex = dayjs().diff(startDate, props.rotation.type === "weekly" ? "week" : "day");

      let rotation = rotateArray(props.rotation.rotation, startIndex);
      rotation = rotation.concat(rotation);
      if (props.rotation.endDate) {
        const endDate = dayjs(props.rotation.endDate);
        rotation = rotation.filter((_, index) => {
          const entryDate = startDate.add(
            index + startIndex,
            props.rotation.type === "weekly" ? "weeks" : "days"
          );

          return entryDate.isBefore(endDate);
        });
      }

      const lootRotation = props.rotation.lootRotation
        ? rotateArray(props.rotation.lootRotation, startIndex)
        : undefined;

      return (
        <Stack>
          <Title order={2} size="h2">
            {props.rotation.name}
            {props.rotation.note ? " *" : ""}
          </Title>
          {props.rotation.note && (
            <Text fs="italic" mt="-16px" c="gray.5">
              * {props.rotation.note}
            </Text>
          )}
          <Stack gap={0}>
            {rotation.map((activities, index) => {
              const entryDate = startDate.add(
                index + startIndex,
                props.rotation.type === "weekly" ? "weeks" : "days"
              );

              // Check for overrides
              let activityIds = activities;
              if (
                (props.rotation.type === "weekly" || props.rotation.type === "daily") &&
                props.rotation.overrides
              ) {
                for (const { startDate, endDate, override } of props.rotation.overrides) {
                  if (isBetween(dayjs(startDate), entryDate, dayjs(endDate))) {
                    activityIds = override;
                    break;
                  }
                }
              }

              return (
                <RotationEntry
                  key={activities.join("|") + index}
                  date={entryDate}
                  activityIds={activityIds}
                  loot={lootRotation ? lootRotation[index % lootRotation.length] : undefined}
                  noLink={!activityTypes.some((type) => type.type === props.rotation.activityType)}
                />
              );
            })}
          </Stack>
        </Stack>
      );
    case "newest":
      return (
        <Stack>
          <Title order={2} size="h2">
            {props.rotation.name}
          </Title>
          <Box>
            <RotationEntry activityIds={[props.rotation.activityId]} big />
          </Box>
        </Stack>
      );
  }
}
