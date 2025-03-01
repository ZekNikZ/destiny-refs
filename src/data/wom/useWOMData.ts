import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { WOMFireteamMember, WOMPunishment, WOMPunishmentList } from "./wom-types";
import { getRandomPunishment, getValidPunishmentListName } from "./wom-utils";
import DEFAULT_LIST from "./default-list.json";

interface WOMState {
  // State
  members: WOMFireteamMember[];
  selectedPunishmentList: string;
  customPunishmentLists: WOMPunishmentList[];
  openModal?: "list" | "edit";
  openEditor?: string;
  draftPunishmentList: WOMPunishmentList;

  // Actions
  addFireteamMember: (member: WOMFireteamMember) => void;
  removeFireteamMember: (username: string) => void;
  clearFireteam: () => void;

  rerollFireteamMember: (username: string) => void;
  addPunishmentToFireteamMember: (username: string) => void;
  rerollAllFireteamMembers: () => void;

  openListModal: () => void;
  openEditModal: (name: string) => void;
  closeModal: () => void;

  selectPunishmentList: (name: string) => void;
  duplicatePunishmentList: (name: string) => void;
  removePunishmentList: (name: string) => void;
  saveOpenPunishmentList: () => void;

  editDraftName: (name: string) => void;
  editDraftEntryWeight: (index: number, weight: number) => void;
  editDraftEntryName: (index: number, name: string) => void;
  editDraftEntryTags: (index: number, tags: string) => void;
  editDraftEntryExtraRolls: (index: number, extraRolls: number) => void;
  addDraftEntry: () => void;
  removeDraftEntry: (index: number) => void;
}

export const useWOMData = create<WOMState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        members: [],
        selectedPunishmentList: "Default",
        customPunishmentLists: [],
        draftPunishmentList: { name: "", punishments: [] },

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

        openListModal() {
          set(() => ({ openModal: "list" }));
        },
        openEditModal(name: string) {
          const draftPunishmentList = get().customPunishmentLists.find((l) => l.name === name);
          if (!draftPunishmentList) {
            return;
          }

          set(() => ({
            openModal: "edit",
            openEditor: name,
            draftPunishmentList,
          }));
        },
        closeModal() {
          set(() => ({ openModal: undefined }));
        },

        selectPunishmentList(name) {
          set(() => ({ selectedPunishmentList: name }));
        },
        duplicatePunishmentList(name) {
          set((state) => ({
            customPunishmentLists: [
              ...state.customPunishmentLists,
              {
                name: getValidPunishmentListName(name),
                punishments:
                  state.customPunishmentLists.find((l) => l.name === name)?.punishments ??
                  DEFAULT_LIST.punishments,
              },
            ],
          }));
        },
        removePunishmentList(name) {
          set((state) => ({
            customPunishmentLists: state.customPunishmentLists.filter((l) => l.name !== name),
            selectedPunishmentList:
              state.selectedPunishmentList === name ? "Default" : state.selectedPunishmentList,
          }));
        },
        saveOpenPunishmentList() {
          set((state) => ({
            customPunishmentLists: state.customPunishmentLists.map((l) =>
              l.name === state.openEditor ? state.draftPunishmentList : l
            ),
            openEditor: undefined,
            openModal: "list",
          }));
        },

        editDraftName(name) {
          set((state) => ({
            draftPunishmentList: { ...state.draftPunishmentList, name },
          }));
        },
        editDraftEntryWeight(index, weight) {
          set((state) => ({
            draftPunishmentList: {
              ...state.draftPunishmentList,
              punishments: state.draftPunishmentList.punishments.map((p, i) =>
                i === index ? { ...p, weight } : p
              ),
            },
          }));
        },
        editDraftEntryName(index, name) {
          set((state) => ({
            draftPunishmentList: {
              ...state.draftPunishmentList,
              punishments: state.draftPunishmentList.punishments.map((p, i) =>
                i === index ? { ...p, text: name } : p
              ),
            },
          }));
        },
        editDraftEntryTags(index, tags) {
          set((state) => ({
            draftPunishmentList: {
              ...state.draftPunishmentList,
              punishments: state.draftPunishmentList.punishments.map((p, i) =>
                i === index
                  ? {
                      ...p,
                      tags: tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t.length > 0),
                    }
                  : p
              ),
            },
          }));
        },
        editDraftEntryExtraRolls(index, extraRolls) {
          set((state) => ({
            draftPunishmentList: {
              ...state.draftPunishmentList,
              punishments: state.draftPunishmentList.punishments.map((p, i) =>
                i === index ? { ...p, extraSpins: extraRolls } : p
              ),
            },
          }));
        },
        addDraftEntry() {
          set((state) => ({
            draftPunishmentList: {
              ...state.draftPunishmentList,
              punishments: [...state.draftPunishmentList.punishments, { text: "" }],
            },
          }));
        },
        removeDraftEntry(index) {
          set((state) => ({
            draftPunishmentList: {
              ...state.draftPunishmentList,
              punishments: state.draftPunishmentList.punishments.filter((_, i) => i !== index),
            },
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
