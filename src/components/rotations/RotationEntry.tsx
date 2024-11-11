import { Group, Stack, Title, Text } from "@mantine/core";
import { useGlobalData } from "../../data/useGlobalData";
import classes from "./RotationEntry.module.scss";
import { Link } from "react-router-dom";
import { makeRouteFromActivity } from "../../utils/routes";
import { Dayjs } from "dayjs";
import clsx from "clsx";
import { Loot } from "../../data/types";
import LootIcon from "../loot/LootIcon";
import { getLootKey } from "../../utils/loot";

interface Props {
  date?: Dayjs;
  activityIds: string[];
  big?: boolean;
  loot?: Loot[];
}

export default function RotationEntry(props: Props) {
  const globalData = useGlobalData();

  const activities = props.activityIds.map((activityId) =>
    globalData.activities.find((activity) => activity.id === activityId)
  );

  return (
    <Group
      gap={0}
      wrap="nowrap"
      className={clsx(classes.entry, {
        [classes.big]: props.big,
      })}
    >
      {props.date && (
        <Text w={120} ta="center">
          {props.date.format("MMMM D")}
        </Text>
      )}
      <Group gap={0} style={{ flexGrow: 1, flexBasis: "150px" }}>
        {activities
          .filter((a) => !!a)
          .map((activity) => (
            <Link to={makeRouteFromActivity(activity)} key={activity.id} className={classes.link}>
              <Stack
                key={activity.id}
                miw={240}
                h={props.big ? 80 : 40}
                className={classes.darkOverlay}
                style={{
                  backgroundImage: `url('${activity.backgroundImage}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "50% 50%",
                }}
                display="flex"
                p="sm"
                justify="center"
              >
                <Title order={3} size={props.big ? "h3" : "h4"} c="white">
                  {activity.name}
                </Title>
              </Stack>
            </Link>
          ))}
      </Group>

      {props.loot && (
        <Group className={classes.loot} gap={4}>
          {props.loot.map((loot) => (
            <LootIcon key={getLootKey(loot)} loot={loot} size={30} />
          ))}
        </Group>
      )}
    </Group>
  );
}
