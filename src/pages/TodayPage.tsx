import { activityTypes } from "../routes";
import TodayPageDisplay from "../components/TodayPageDisplay";
import { useGlobalData } from "../data/useGlobalData";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Group, Stack } from "@mantine/core";
import dayjs from "dayjs";
import Countdown from "../components/Countdown";
import { isBetween } from "../utils/dates";

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
    </Stack>
  );
}
