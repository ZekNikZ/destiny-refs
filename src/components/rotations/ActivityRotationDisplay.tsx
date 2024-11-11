import { Box, Stack, Title } from "@mantine/core";
import { ActivityRotation } from "../../data/types";
import RotationEntry from "./RotationEntry";
import dayjs from "dayjs";
import { rotateArray } from "../../utils/arrays";

interface Props {
  rotation: ActivityRotation;
}

export default function ActivityRotationDisplay(props: Props) {
  switch (props.rotation.type) {
    case "weekly":
    case "daily":
      const startDate = dayjs(props.rotation.startDate);
      const startIndex = dayjs().diff(startDate, "week");
      const rotation = rotateArray(
        props.rotation.rotation,
        startIndex % props.rotation.rotation.length
      );
      const lootRotation = props.rotation.lootRotation;

      return (
        <Stack style={{ flexGrow: 1 }}>
          <Title order={2} size="h2">
            {props.rotation.name}
          </Title>
          <Stack gap={0}>
            {rotation.concat(rotation).map((activities, index) => {
              return (
                <RotationEntry
                  key={activities.join("|") + index}
                  date={startDate.add(index + startIndex, "weeks")}
                  activityIds={activities}
                  loot={lootRotation ? lootRotation[index % lootRotation.length] : undefined}
                />
              );
            })}
          </Stack>
        </Stack>
      );
    case "newest":
      return (
        <Stack style={{ flexGrow: 1 }}>
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
