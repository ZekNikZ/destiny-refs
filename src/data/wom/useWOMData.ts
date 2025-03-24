import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { WOMFireteamMember, WOMPunishment, WOMPunishmentList } from "./wom-types";
import { getRandomPunishment, getValidPunishmentListName } from "./wom-utils";
import { v4 as uuidv4 } from "uuid";
import DEFAULT_LIST from "./default-list.json";
import { checkForUpdates } from "../../utils/check-for-updates";

interface WOMState {
  // State
  members: WOMFireteamMember[];
  selectedPunishmentList: string;
  customPunishmentLists: WOMPunishmentList[];

  openModal?: "list" | "edit";
  openEditor: string;

  previousState: WOMFireteamMember[][];

  // Actions
  setMembers: (members: WOMFireteamMember[]) => void;
  undo: () => void;

  addFireteamMember: (member: WOMFireteamMember) => void;
  removeFireteamMember: (username: string) => void;
  clearFireteam: () => void;

  rerollFireteamMember: (username: string) => void;
  addPunishmentToFireteamMember: (username: string) => void;
  rerollAllFireteamMembers: () => void;

  openListModal: () => void;
  openEditModal: (id: string) => void;
  closeModal: () => void;

  selectPunishmentList: (id: string) => void;
  duplicatePunishmentList: (id: string) => void;
  removePunishmentList: (id: string) => void;
  importPunishmentList: (list: WOMPunishmentList) => void;
  exportPunishmentList: (id: string) => void;
  createEmptyPunishmentList: () => void;
  editPunishmentList: (list: WOMPunishmentList) => void;
}

export const useWOMData = create<WOMState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        members: [],
        selectedPunishmentList: "default",
        customPunishmentLists: [],
        openEditor: "default",
        draftPunishmentList: { id: 0, name: "", punishments: [] },
        previousState: [],

        // Actions
        setMembers(members) {
          set((state) => ({ members, previousState: [...state.previousState, state.members] }));
        },
        undo() {
          if (get().previousState.length === 0) {
            return;
          }

          set((state) => ({
            members: state.previousState[state.previousState.length - 1],
            previousState: state.previousState.slice(0, state.previousState.length - 1),
          }));
        },

        addFireteamMember(member) {
          get().setMembers([...get().members, member]);
        },
        removeFireteamMember(username) {
          get().setMembers(get().members.filter((member) => member.username !== username));
        },
        clearFireteam() {
          get().setMembers([]);
        },

        rerollFireteamMember(username) {
          // Get the new punishment
          const punishment = getRandomPunishment(
            [],
            get().members.flatMap((m) => m.punishments)
          );

          // Add the punishment to the member
          get().setMembers(
            get().members.map((m) =>
              m.username === username ? { ...m, punishments: [punishment] } : m
            )
          );
        },
        addPunishmentToFireteamMember(username) {
          // Get the new punishment
          const punishment = getRandomPunishment(
            get().members.find((m) => m.username === username)?.punishments,
            get().members.flatMap((m) => m.punishments)
          );

          // Add the punishment to the member
          get().setMembers(
            get().members.map((m) =>
              m.username === username ? { ...m, punishments: [...m.punishments, punishment] } : m
            )
          );
        },
        rerollAllFireteamMembers() {
          checkForUpdates();

          const teamPunishmentsSoFar: WOMPunishment[] = [];
          get().setMembers(
            get().members.map((member) => {
              // Get the new punishment
              const punishment = getRandomPunishment([], teamPunishmentsSoFar);

              teamPunishmentsSoFar.push(punishment);

              return { ...member, punishments: [punishment] };
            })
          );
        },

        openListModal() {
          set(() => ({ openModal: "list" }));
        },
        openEditModal(id) {
          const draftPunishmentList = get().customPunishmentLists.find((l) => l.id === id);
          if (!draftPunishmentList) {
            return;
          }

          set(() => ({
            openModal: "edit",
            openEditor: id,
            draftPunishmentList,
          }));
        },
        closeModal() {
          set(() => ({ openModal: undefined }));
        },

        selectPunishmentList(id) {
          set(() => ({ selectedPunishmentList: id }));
        },
        duplicatePunishmentList(id) {
          const listToCopy = get().customPunishmentLists.find((l) => l.id === id);
          set((state) => ({
            customPunishmentLists: [
              ...state.customPunishmentLists,
              {
                id: uuidv4(),
                name: getValidPunishmentListName(listToCopy?.name ?? "Default"),
                punishments:
                  listToCopy?.punishments ?? (DEFAULT_LIST as WOMPunishmentList).punishments,
              },
            ],
          }));
        },
        removePunishmentList(id) {
          set((state) => ({
            customPunishmentLists: state.customPunishmentLists.filter((l) => l.id !== id),
            selectedPunishmentList:
              state.selectedPunishmentList === id ? "default" : state.selectedPunishmentList,
          }));
        },
        createEmptyPunishmentList() {
          set((state) => ({
            customPunishmentLists: [
              ...state.customPunishmentLists,
              {
                id: uuidv4(),
                name: getValidPunishmentListName("New List"),
                punishments: [],
              },
            ],
          }));
        },
        importPunishmentList(list) {
          set((state) => ({
            customPunishmentLists: [
              ...state.customPunishmentLists,
              {
                ...list,
                id: uuidv4(),
              },
            ],
          }));
        },
        exportPunishmentList(id) {
          const list =
            get().customPunishmentLists.find((l) => l.id === id) ??
            (DEFAULT_LIST as WOMPunishmentList);

          var a = document.createElement("a");
          var file = new Blob([JSON.stringify(list)], { type: "application/json" });
          a.href = URL.createObjectURL(file);
          a.download = `Wheel of Misfortune - ${list.name}.json`;
          a.click();
          a.remove();
        },
        editPunishmentList(list) {
          set((state) => ({
            customPunishmentLists: state.customPunishmentLists.map((l) =>
              l.id === list.id ? list : l
            ),
            openEditor: undefined,
            openModal: "list",
          }));
        },
      }),
      {
        name: "wom",
        partialize: ({ members, selectedPunishmentList, customPunishmentLists }) => ({
          members: members.filter((member) => member.source === "manual"),
          selectedPunishmentList,
          customPunishmentLists,
        }),
      }
    )
  )
);
