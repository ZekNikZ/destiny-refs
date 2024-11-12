import { Stack, Title } from "@mantine/core";
import ActivityCard from "./activity/ActivityCard";
import { Activity, ActivityRotation } from "../data/types";
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
  const availability = useRotation(props.activity);
  const link = makeRouteFromActivity(props.activity);

  const card = (
    <ActivityCard
      key={props.activity.id}
      activity={props.activity}
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

export default function RotationEntry(props: Props) {
  const { activities } = useGlobalData();

  const activeActivities: Activity[] = props.rotations.flatMap((rotation) => {
    switch (rotation.type) {
      case "weekly":
      case "daily":
        let index: number = -1;
        const startDate = dayjs(rotation.startDate);
        switch (rotation.type) {
          case "daily":
            index = dayjs().diff(startDate, "day") % rotation.rotation.length;
            break;
          case "weekly":
            index = dayjs().diff(startDate, "week") % rotation.rotation.length;
            break;
        }
        return rotation.rotation[index].map(
          (activityId) => activities.find((x) => x.id === activityId)!
        );
      default:
      case "newest":
        return activities.find((x) => x.id === rotation.activityId)!;
    }
  });

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
