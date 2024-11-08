import { Box, Breadcrumbs, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import ActivityCard from "../components/activity/ActivityCard";

import { useGlobalData } from "../data/useData";

const TodayPage = () => {
  const activity = useGlobalData((state) => state.data.activities[0]);

  const masterAvailable = true;
  const featured = "newest";
  const doubleLootActive = false;

  return (
    <Stack>
      <Breadcrumbs>
        <Link to="/info">Loot & Details</Link>
        <Link to="/info/raids">Raids</Link>
        <Text>Salvation's Edge</Text>
      </Breadcrumbs>
      <ActivityCard
        activity={activity}
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
        {activity.encounters?.map((encounter, index) => (
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
};

export default TodayPage;
