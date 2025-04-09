import { Group, Title, Text, Image, Box } from "@mantine/core";
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
  noLink?: boolean;
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
        <Text w={120} ta="center" fw="bold">
          {props.date.format("MMMM D")}
        </Text>
      )}
      <Group gap={0} style={{ flexGrow: 1, flexBasis: "150px", alignItems: "stretch" }}>
        {activities
          .filter((a) => !!a)
          .map((activity) => {
            const inside = (
              <Group
                key={activity.id}
                miw={240}
                mih={props.big ? 80 : 40}
                h="100%"
                className={classes.darkOverlay}
                style={{
                  backgroundImage: `url('${activity.backgroundImage}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "50% 50%",
                }}
                display="flex"
                pl="sm"
                pr="sm"
                pt={4}
                pb={4}
                align="center"
                gap={4}
              >
                <Title order={3} size={props.big ? "h3" : "h4"} c="white">
                  {activity.name}
                </Title>

                {activity.championTypes?.map((type) => (
                  <Image
                    key={type}
                    src={`/icons/attributes/${type}.svg`}
                    alt={type}
                    h={20}
                    w={20}
                  />
                ))}
              </Group>
            );
            return props.noLink ? (
              <Box className={classes.nolink}>{inside}</Box>
            ) : (
              <Link to={makeRouteFromActivity(activity)} key={activity.id} className={classes.link}>
                {inside}
              </Link>
            );
          })}
        {props.loot && props.loot.length > 0 && (
          <Group gap={4} wrap="wrap" p={4} maw="242px">
            {props.loot.map((loot) => (
              <LootIcon key={getLootKey(loot)} loot={loot} size={30} />
            ))}
          </Group>
        )}
      </Group>
    </Group>
  );
}
