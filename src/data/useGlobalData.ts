import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { ActivitiesJson, ActivityJson, LootJson, RotationsJson } from "./json-types";
import { Activity } from "./types";
import { applyLootRefs } from "./data-helpers";

interface GlobalState {
  activities: Activity[];
  rotations: RotationsJson;
  loot: LootJson;
}

export const useGlobalData = create<GlobalState>()(
  devtools(
    persist(
      (_set) => ({
        activities: [],
        rotations: { featuredRotations: [], challengeRotations: [] },
        loot: { sharedLoot: {}, doubleLootOverrides: [] },
      }),
      {
        name: "global-data",
      }
    )
  )
);

// Fetch data
const [rotations, loot, activitiesJson] = await Promise.all([
  fetch("/data/rotations.json").then((res) => res.json() as Promise<RotationsJson>),
  fetch("/data/loot.json").then((res) => res.json() as Promise<LootJson>),
  fetch("/data/activities.json").then((res) => res.json() as Promise<ActivitiesJson>),
]);

const activities = await Promise.all(
  activitiesJson.activities.map((id) =>
    fetch(`/data/activities/${id}.json`)
      .then((res) => res.json() as Promise<ActivityJson>)
      .then((json) => applyLootRefs(json.activity, loot.sharedLoot))
  )
);

useGlobalData.setState({
  activities,
  rotations,
  loot,
});
