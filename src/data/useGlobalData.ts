import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import {
  ActivitiesJson,
  ActivityJson,
  CountdownsJson,
  LootJson,
  RotationsJson,
} from "./json-types";
import { Activity, Countdown } from "./types";
import { applyLootRefs } from "./data-helpers";
import dayjs from "dayjs";
import { getLatestCommitHash } from "../utils/check-for-updates";

interface GlobalState {
  bungieApiError: boolean;
  bungieApiLoading: boolean;
  activities: Activity[];
  rotations: RotationsJson;
  loot: LootJson;
  countdowns: Countdown[];

  lastUpdateCheck: number;
  checkForUpdates: () => Promise<void>;
}

export const useGlobalData = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        bungieApiError: false,
        bungieApiLoading: false,
        activities: [],
        rotations: { activityRotations: [], challengeRotations: [] },
        loot: { sharedLoot: { loot: {}, sets: {}, pools: {} }, doubleLootOverrides: [] },
        countdowns: [],
        lastUpdateCheck: 0,
        checkForUpdates: async () => {
          if (get().lastUpdateCheck > Date.now() - 1000 * 60 * 10) return;

          console.log("Checking for updates...");
          set({ lastUpdateCheck: Date.now() });

          const hash = await getLatestCommitHash("ZekNikZ", "destiny-refs");
          console.log("Latest commit hash:", hash);

          if (hash === import.meta.env.VITE_COMMIT_HASH) {
            console.log("No updates found.");
          } else {
            console.log("Update found, reloading...");
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }
        },
      }),
      {
        name: "global-data",
      }
    )
  )
);

// Fetch data
const [rotations, loot, activitiesJson, countdowns] = await Promise.all([
  fetch("/data/rotations.json").then((res) => res.json() as Promise<RotationsJson>),
  fetch("/data/loot.json").then((res) => res.json() as Promise<LootJson>),
  fetch("/data/activities.json").then((res) => res.json() as Promise<ActivitiesJson>),
  fetch("/data/countdowns.json").then((res) => res.json() as Promise<CountdownsJson>),
]);

const activities = await Promise.all(
  activitiesJson.activities.map((id) =>
    fetch(`/data/activities/${id}.json`)
      .then((res) => res.json() as Promise<ActivityJson>)
      .then((json) => applyLootRefs(json.activity, loot.sharedLoot))
  )
);

useGlobalData.setState({
  bungieApiError: false,
  bungieApiLoading: false,
  activities,
  rotations,
  loot,
  countdowns: countdowns.countdowns.map(({ title, date }) => ({ title, date: dayjs(date) })),
});
