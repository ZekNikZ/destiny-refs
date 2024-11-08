import dataJson from "./data.json";
import { JsonData } from "./types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { buildRealData } from "./data-helpers";

interface GlobalState {
  data: JsonData;
}

export const useGlobalData = create<GlobalState>()(
  devtools(
    persist(
      (_set) => ({
        data: buildRealData(dataJson as any),
      }),
      {
        name: "global-data",
      }
    )
  )
);
