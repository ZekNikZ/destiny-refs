import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { WOMFireteamMember, WOMPunishment, WOMPunishmentList } from "./wom-types";
import { getRandomPunishment } from "./wom-utils";

interface WOMState {
  // State
  members: WOMFireteamMember[];
  selectedPunishmentList: string | null;
  customPunishmentLists: WOMPunishmentList[];

  // Actions
  addFireteamMember: (member: WOMFireteamMember) => void;
  removeFireteamMember: (username: string) => void;
  clearFireteam: () => void;

  rerollFireteamMember: (username: string) => void;
  addPunishmentToFireteamMember: (username: string) => void;
  rerollAllFireteamMembers: () => void;
}

export const useWOMData = create<WOMState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        members: [],
        selectedPunishmentList: null,
        customPunishmentLists: [],

        // Actions
        addFireteamMember(member) {
          set((state) => ({
            members: [...state.members, member],
          }));
        },
        removeFireteamMember(username) {
          set((state) => ({
            members: state.members.filter((member) => member.username !== username),
          }));
        },
        clearFireteam() {
          set(() => ({
            members: [],
          }));
        },

        rerollFireteamMember(username) {
          // Get the new punishment
          const punishment = getRandomPunishment(
            [],
            get().members.flatMap((m) => m.punishments ?? [])
          );

          // Add the punishment to the member
          set((state) => ({
            members: state.members.map((m) =>
              m.username === username ? { ...m, punishments: [punishment] } : m
            ),
          }));
        },
        addPunishmentToFireteamMember(username) {
          // Get the new punishment
          const punishment = getRandomPunishment(
            get().members.find((m) => m.username === username)?.punishments ?? [],
            get().members.flatMap((m) => m.punishments ?? [])
          );

          // Add the punishment to the member
          set((state) => ({
            members: state.members.map((m) =>
              m.username === username
                ? { ...m, punishments: [...(m.punishments ?? []), punishment] }
                : m
            ),
          }));
        },
        rerollAllFireteamMembers() {
          const teamPunishmentsSoFar: WOMPunishment[] = [];
          set((state) => ({
            members: state.members.map((member) => {
              // Get the new punishment
              const punishment = getRandomPunishment([], teamPunishmentsSoFar);

              teamPunishmentsSoFar.push(punishment);

              return { ...member, punishments: [punishment] };
            }),
          }));
        },
      }),
      {
        name: "wom",
        partialize: ({ members, customPunishmentLists }) => ({
          members: members.filter((member) => member.source === "manual"),
          customPunishmentLists,
        }),
      }
    )
  )
);
