import { Stack, Title } from "@mantine/core";
import ActivityCard from "./activity/ActivityCard";
import { Activity, ActivityRotation, LootPool } from "../data/types";
import dayjs from "dayjs";
import { useGlobalData } from "../data/useGlobalData";
import useRotation from "../data/useRotation";
import { Link } from "react-router-dom";
import { makeRouteFromActivity } from "../utils/routes";

interface Props {
  title: string;
  rotations: ActivityRotation[];
  disableLinks?: boolean;
}

function ActivityCardWrapper(props: { activity: Activity; disableLink?: boolean }) {
  const [availability, loot] = useRotation(props.activity);
  const link = makeRouteFromActivity(props.activity);

  const card = (
    <ActivityCard
      key={props.activity.id}
      activity={{
        ...props.activity,
        loot: loot
          ? [{ type: "pool", quantity: 1, showInLootSummary: true, loot }]
          : props.activity.loot,
      }}
      availability={availability}
      forceState="summary"
      style={{ height: "100%" }}
    />
  );

  return props.disableLink ? (
    card
  ) : (
    <Link to={link} style={{ textDecoration: "none" }}>
      {card}
    </Link>
  );
}

export default function TodayPageDisplay(props: Props) {
  const { activities } = useGlobalData();

  const activeActivities: Activity[] = props.rotations
    .flatMap((rotation) => {
      switch (rotation.type) {
        case "weekly":
        case "daily":
          const startDate = dayjs(rotation.startDate);
          const index = dayjs().diff(startDate, rotation.type === "weekly" ? "week" : "day");

          const result = rotation.rotation[index % rotation.rotation.length].map((activityId) =>
            activities.find((x) => x.id === activityId)
          );
          const lootRotation = rotation.lootRotation?.[index % rotation.lootRotation.length];

          return result.map((activity) => {
            if (activity && lootRotation) {
              return {
                ...activity,
                loot: [
                  { type: "pool", quantity: 1, showInLootSummary: true, loot: lootRotation },
                ] as LootPool[],
              };
            } else {
              return activity;
            }
          });
        default:
        case "newest":
          return activities.find((x) => x.id === rotation.activityId);
      }
    })
    .filter((x) => !!x);

  return (
    <Stack mt="md">
      <Title order={2} size="h2">
        {props.title}
      </Title>
      <Stack>
        {activeActivities.map((activity) => (
          <ActivityCardWrapper
            key={activity.id}
            activity={activity}
            disableLink={props.disableLinks}
          />
        ))}
      </Stack>
    </Stack>
  );
}
