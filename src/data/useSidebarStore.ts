// eslint-disable-next-line import/no-empty-named-blocks
import type {} from "@redux-devtools/extension"; // Required for devtools typing
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SidebarState {
  openTab: string;
  setOpenTab: (path: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        openTab: "",
        setOpenTab: (path) => set(() => ({ openTab: path })),
      }),
      {
        name: "sidebar-storage",
      }
    )
  )
);
