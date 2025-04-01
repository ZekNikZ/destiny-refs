import { useMemo } from "react";
import { Activity, ActivityType } from "../data/types";
import { useGlobalData } from "../data/useGlobalData";
import SmartBreadcrumbs from "../components/SmartBreadcrumbs";
import { Box, Stack, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ActivityCard from "../components/activity/ActivityCard";
import useRotation from "../data/useRotation";
import { Link } from "react-router-dom";
import classes from "./ActivityListPage.module.scss";
import { makeRouteFromActivity } from "../utils/routes";
import groupBy from "lodash.groupby";
import React from "react";

interface Props {
  activityType: ActivityType;
  disableLinks?: boolean;
  dashboard?: boolean;
}

function ActivityCardWrapper(props: {
  activity: Activity;
  disableLink?: boolean;
  forceState?: boolean;
  dashboard?: boolean;
}) {
  const [availability] = useRotation(props.activity);
  const link = makeRouteFromActivity(props.activity);

  const card = (
    <ActivityCard
      key={props.activity.id}
      activity={props.activity}
      availability={availability}
      forceState={props.forceState ? "summary" : false}
      style={props.forceState ? { height: "100%" } : undefined}
      hideDetails={!props.disableLink}
    />
  );

  return props.disableLink ? (
    <div>{card}</div>
  ) : (
    <Link to={link} className={classes.activityLink}>
      {card}
    </Link>
  );
}

export default function ActivityListPage(props: Props) {
  const activities = useGlobalData((state) => state.activities);

  const isLargeScreen = useMediaQuery("(min-width: 800px)");

  const groupedActivities = useMemo(() => {
    const filteredActivities = activities.filter(
      (activity) => activity.type === props.activityType
    );

    const groups = Object.entries(
      groupBy(filteredActivities, (activity) => activity.category ?? "Other")
    );

    // Sort group contents by name if >1 group
    if (groups.length > 1) {
      for (const [_, group] of groups) {
        group.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    // Sort groups by name
    groups.sort((a, b) => (a[0] ?? "ZZZ").localeCompare(b[0] ?? "ZZZ"));

    return groups;
  }, [activities, props.activityType]);

  return (
    <Stack>
      <SmartBreadcrumbs />
      {groupedActivities.map(([category, groupActivities]) => (
        <React.Fragment key={category ?? "Other"}>
          {groupedActivities.length > 1 && <Title size="h2">{category ?? "Other"}</Title>}
          <Box
            display="grid"
            style={{
              gridTemplateColumns: `repeat(auto-fit, ${isLargeScreen ? `minmax(${props.dashboard ? "600px" : "450px"}, 1fr)` : "1fr"})`,
              gap: "var(--mantine-spacing-md)",
            }}
            mb="md"
          >
            {groupActivities.map((activity) => (
              <ActivityCardWrapper
                key={activity.id}
                activity={activity}
                disableLink={props.disableLinks}
                forceState={!props.dashboard}
              />
            ))}
          </Box>
        </React.Fragment>
      ))}
    </Stack>
  );
}
