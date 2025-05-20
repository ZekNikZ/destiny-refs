import { activityTypes } from "../routes";
import TodayPageDisplay from "../components/TodayPageDisplay";
import { useGlobalData } from "../data/useGlobalData";
import { Grid, Group, Stack, Title } from "@mantine/core";
import dayjs from "dayjs";
import Countdown from "../components/Countdown";
import { isBetween } from "../utils/dates";
import BlueskyAccountFeed from "../components/BlueskyAccountFeed";
import { BlueskyConfigProvider } from "bluesky-embed-react";

export default function TodayPage() {
  const { rotations, countdowns } = useGlobalData();

  const now = dayjs();

  let nextWeeklyReset = now.utc().day(2).hour(17).minute(0).second(0);
  if (now.isAfter(nextWeeklyReset)) {
    nextWeeklyReset = nextWeeklyReset.add(7, "days");
  }

  let nextDailyReset = now.utc().startOf("day").hour(17).minute(0).second(0);
  if (now.isAfter(nextDailyReset)) {
    nextDailyReset = nextDailyReset.add(1, "day");
  }

  return (
    <Stack>
      <Group justify="center">
        <Countdown title="Weekly Reset" to={nextWeeklyReset} />
        <Countdown title="Daily Reset" to={nextDailyReset} />
        {countdowns
          .filter((countdown) => dayjs(countdown.date).isAfter(now))
          .map(({ title, date }) => (
            <Countdown key={title} title={title} to={date} />
          ))}
      </Group>
      <Grid gutter="md">
        {activityTypes.map((activityType) => (
          <Grid.Col key={activityType.title} span={{ base: 12, md: 6, lg: 4 }}>
            <TodayPageDisplay
              key={activityType.type}
              title={activityType.title}
              rotations={rotations.activityRotations.filter(
                (rotation) => rotation.activityType === activityType.type
              )}
              disableLinks={activityType.disableLinks}
            />
          </Grid.Col>
        ))}
        {rotations.activityRotations
          .filter((x) => x.activityType === "misc" && x.type !== "event")
          .map((rotation) => (
            <Grid.Col key={rotation.id} span={{ base: 12, md: 6, lg: 4 }}>
              <TodayPageDisplay
                key={rotation.id}
                title={rotation.name}
                rotations={[rotation]}
                disableLinks
              />
            </Grid.Col>
          ))}
        {rotations.activityRotations
          .filter((rotation) => rotation.type === "event")
          .filter((rotation) => isBetween(dayjs(rotation.startDate), now, dayjs(rotation.endDate)))
          .map((rotation) => (
            <Grid.Col key={rotation.id} span={{ base: 12, md: 6, lg: 4 }}>
              <TodayPageDisplay
                key={rotation.id}
                title={`Limited Time: ${rotation.name}`}
                rotations={[rotation]}
                disableLinks
              />
            </Grid.Col>
          ))}
      </Grid>
      <Title order={2} size="h2">
        Bluesky Feeds
      </Title>
      <BlueskyConfigProvider width="clamp(27vw, 500px, 90vw)" openLinksInNewTab>
        <Group gap="md" align="flex-start" justify="center">
          <BlueskyAccountFeed userHandle="bungiehelp.bungie.net" postLimit={8} />
          <BlueskyAccountFeed userHandle="destiny2team.bungie.net" postLimit={6} />
          <BlueskyAccountFeed userHandle="destinythegame.bungie.net" postLimit={2} />
        </Group>
      </BlueskyConfigProvider>
    </Stack>
  );
}
