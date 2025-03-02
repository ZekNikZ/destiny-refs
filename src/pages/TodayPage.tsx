import { activityTypes } from "../routes";
import TodayPageDisplay from "../components/TodayPageDisplay";
import { useGlobalData } from "../data/useGlobalData";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Group, Stack, Title } from "@mantine/core";
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
        {countdowns.map(({ title, date }) => (
          <Countdown key={title} title={title} to={date} />
        ))}
      </Group>
      <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 1100: 2, 1600: 3 }}>
        <Masonry columnsCount={2} gutter="16px">
          {activityTypes.map((activityType) => (
            <TodayPageDisplay
              key={activityType.type}
              title={activityType.title}
              rotations={rotations.activityRotations.filter(
                (rotation) => rotation.activityType === activityType.type
              )}
              disableLinks={activityType.disableLinks}
            />
          ))}
          {rotations.activityRotations
            .filter((rotation) => rotation.type === "event")
            .filter((rotation) =>
              isBetween(dayjs(rotation.startDate), now, dayjs(rotation.endDate))
            )
            .map((rotation) => (
              <TodayPageDisplay
                key={rotation.id}
                title={rotation.name}
                rotations={[rotation]}
                disableLinks
              />
            ))}
        </Masonry>
      </ResponsiveMasonry>
      <Title order={2} size="h2">
        Bluesky Feeds
      </Title>
      <BlueskyConfigProvider width="min(500px, 90vw)" openLinksInNewTab>
        <Group gap="md" align="flex-start" wrap="nowrap" style={{ overflowX: "auto" }}>
          <BlueskyAccountFeed userHandle="bungiehelp.bungie.net" />
          <BlueskyAccountFeed userHandle="destiny2team.bungie.net" />
          <BlueskyAccountFeed userHandle="destinythegame.bungie.net" />
        </Group>
      </BlueskyConfigProvider>
    </Stack>
  );
}
