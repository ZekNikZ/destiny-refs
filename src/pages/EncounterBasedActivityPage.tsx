import { Box, Stack } from "@mantine/core";
import ActivityCard from "../components/activity/ActivityCard";
import { Activity } from "../data/types";
import SmartBreadcrumbs from "../components/SmartBreadcrumbs";
import useRotation from "../data/useRotation";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  activity: Activity;
}

export default function EncounterBasedActivityPage(props: Props) {
  const [availability] = useRotation(props.activity);

  const isLargeScreen = useMediaQuery("(min-width: 1000px)");

  const numOpeningEncounters =
    props.activity.encounters?.filter((encounter) => encounter.type === "opening-encounter")
      .length ?? 0;

  return (
    <Stack>
      <SmartBreadcrumbs />
      <ActivityCard activity={props.activity} availability={availability} forceState="details" />
      <Box
        display="grid"
        style={{
          gridTemplateColumns: `repeat(auto-fit, ${isLargeScreen ? "minmax(550px, 1fr)" : "1fr"})`,
          gap: "var(--mantine-spacing-md)",
        }}
      >
        {props.activity.encounters?.map((encounter, index) => (
          <ActivityCard
            encounter
            key={encounter.name}
            titlePrefix={
              index >= numOpeningEncounters
                ? `Encounter ${index + 1 - numOpeningEncounters}: `
                : undefined
            }
            activity={encounter}
            availability={{
              ...availability,
              allChallengesActive:
                index >= numOpeningEncounters ? availability.allChallengesActive : false,
            }}
          />
        ))}
      </Box>
    </Stack>
  );
}
