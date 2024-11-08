import { Box, Stack } from "@mantine/core";
import ActivityCard from "../components/activity/ActivityCard";
import { Activity } from "../data/types";
import SmartBreadcrumbs from "../components/SmartBreadcrumbs";

interface Props {
  activity: Activity;
}

export default function EncounterBasedActivityPage(props: Props) {
  const masterAvailable = true;
  const featured = "newest";
  const doubleLootActive = false;

  return (
    <Stack>
      <SmartBreadcrumbs />
      <ActivityCard
        activity={props.activity}
        availability={{
          featured,
          masterAvailable,
          doubleLootActive,
        }}
        forceState="details"
      />
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
            availability={{
              featured,
              challengeActive: index === 4,
              masterAvailable,
              doubleLootActive,
            }}
          />
        ))}
      </Box>
    </Stack>
  );
}
