import dayjs from "dayjs";
import { Activity, ActivityAvailability, Loot } from "./types";
import { useGlobalData } from "./useGlobalData";
import { useMemo } from "react";
import { isBetween } from "../utils/dates";

export default function useRotation(activity: Activity) {
  const featuredRotations = useGlobalData((state) => state.rotations.activityRotations);
  const challengeRotations = useGlobalData((state) => state.rotations.challengeRotations);
  const date = dayjs().date();

  // Get double loot state
  const doubleLootActive = useGlobalData((state) =>
    state.loot.doubleLootOverrides.includes(activity.id)
  );

  const result = useMemo(() => {
    // Get featured state
    let featured: ActivityAvailability["featured"] = false;
    let loot: Loot[] | undefined;
    for (const rotation of featuredRotations) {
      if (rotation.type === "newest" && rotation.activityId === activity.id) {
        featured = "newest";
        break;
      } else if (
        (rotation.type === "weekly" || rotation.type === "daily") &&
        rotation.rotation.some((set) => set.includes(activity.id))
      ) {
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

        // Check for override
        let isOverridden = false;
        let isOverridenToThis = false;
        if (rotation.overrides) {
          for (const { startDate, endDate, override } of rotation.overrides) {
            if (isBetween(dayjs(startDate), dayjs(), dayjs(endDate))) {
              isOverridden = true;
              isOverridenToThis = override.includes(activity.id);
              break;
            }
          }
        }

        if (
          (!isOverridden && rotation.rotation[index]?.includes(activity.id)) ||
          isOverridenToThis
        ) {
          featured = "active";

          // Get loot rotation
          if (rotation.lootRotation) {
            loot = rotation.lootRotation[index];
          }
        }

        break;
      }
    }

    // Get active challenge, if any
    const activeChallenges: string[] = [];
    for (const rotation of challengeRotations.filter(
      (rotation) => rotation.parentActivityId === activity.id
    )) {
      const startDate = dayjs(rotation.startDate);
      const index = dayjs().diff(startDate, "week") % rotation.rotation.length;

      activeChallenges.push(rotation.rotation[index]);
    }

    const availabilityResult = {
      featured,
      masterAvailable: !!(activity.hasMasterMode && featured),
      allChallengesActive: activity.type === "raid" && featured === "active",
      activeChallenges,
      doubleLootActive,
    } as ActivityAvailability;

    return [availabilityResult, loot] as const;
  }, [activity.id, featuredRotations, challengeRotations, doubleLootActive, date]);

  return result;
}
