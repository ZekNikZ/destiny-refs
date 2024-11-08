import { Box, Stack } from "@mantine/core";
import ActivityCard from "../components/activity/ActivityCard";
import { Activity } from "../data/types";
import SmartBreadcrumbs from "../components/SmartBreadcrumbs";
import useRotation from "../data/useRotation";

interface Props {
  activity: Activity;
}

export default function EncounterBasedActivityPage(props: Props) {
  const availability = useRotation(props.activity);

  return (
    <Stack>
      <SmartBreadcrumbs />
      <ActivityCard activity={props.activity} availability={availability} forceState="details" />
      <Box
        display="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(550px, 1fr))",
          gap: "var(--mantine-spacing-md)",
        }}
      >
        {props.activity.encounters?.map((encounter, index) => (
          <ActivityCard
            encounter
            key={encounter.name}
            titlePrefix={`Encounter ${index + 1}: `}
            activity={encounter}
            availability={availability}
          />
        ))}
      </Box>
    </Stack>
  );
}
