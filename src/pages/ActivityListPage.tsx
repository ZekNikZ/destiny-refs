import { useMemo } from "react";
import { Activity, ActivityType } from "../data/types";
import { useGlobalData } from "../data/useGlobalData";
import SmartBreadcrumbs from "../components/SmartBreadcrumbs";
import { Box, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ActivityCard from "../components/activity/ActivityCard";
import useRotation from "../data/useRotation";
import { Link } from "react-router-dom";
import classes from "./ActivityListPage.module.scss";
import { makeRouteFromActivity } from "../utils/routes";

interface Props {
  activityType: ActivityType;
}

function ActivityCardWrapper(props: { activity: Activity }) {
  const availability = useRotation(props.activity);
  const link = makeRouteFromActivity(props.activity);

  return (
    <Link to={link} className={classes.activityLink}>
      <ActivityCard
        key={props.activity.id}
        activity={props.activity}
        availability={availability}
        forceState="summary"
      />
    </Link>
  );
}

export default function ActivityListPage(props: Props) {
  const activities = useGlobalData((state) => state.activities);

  const isLargeScreen = useMediaQuery("(min-width: 800px)");

  const filteredActivities = useMemo(
    () => activities.filter((activity) => activity.type === props.activityType),
    [activities, props.activityType]
  );

  return (
    <Stack>
      <SmartBreadcrumbs />
      <Box
        display="grid"
        style={{
          gridTemplateColumns: `repeat(auto-fit, ${isLargeScreen ? "minmax(450px, 1fr)" : "1fr"})`,
          gap: "var(--mantine-spacing-md)",
        }}
      >
        {filteredActivities?.map((activity) => (
          <ActivityCardWrapper key={activity.id} activity={activity} />
        ))}
      </Box>
    </Stack>
  );
}
