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

interface GlobalState {
  bungieApiError: boolean;
  bungieApiLoading: boolean;
  activities: Activity[];
  rotations: RotationsJson;
  loot: LootJson;
  countdowns: Countdown[];
}

export const useGlobalData = create<GlobalState>()(
  devtools(
    persist(
      (_set) => ({
        bungieApiError: false,
        bungieApiLoading: false,
        activities: [],
        rotations: { activityRotations: [], challengeRotations: [] },
        loot: { sharedLoot: { loot: {}, sets: {}, pools: {} }, doubleLootOverrides: [] },
        countdowns: [],
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
