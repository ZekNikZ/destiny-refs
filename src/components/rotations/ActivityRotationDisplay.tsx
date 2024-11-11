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

      let rotation: string[][];
      switch (props.rotation.rotationLimit) {
        case "limited":
          rotation = props.rotation.rotation.slice(startIndex);
          break;
        case "infinite":
          rotation = rotateArray(props.rotation.rotation, startIndex);
          rotation = rotation.concat(rotation);
          break;
      }

      const lootRotation = props.rotation.lootRotation
        ? rotateArray(props.rotation.lootRotation, startIndex)
        : undefined;

      return (
        <Stack>
          <Title order={2} size="h2">
            {props.rotation.name}
          </Title>
          <Stack gap={0}>
            {rotation.map((activities, index) => {
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
