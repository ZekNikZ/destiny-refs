import { useWOMData } from "./useWOMData";
import { WOMPunishment, WOMPunishmentList } from "./wom-types";
import { v4 as uuidv4 } from "uuid";
import DEFAULT_LIST from "./default-list.json";

export function flattenPunishments(punishments: WOMPunishment[]): WOMPunishment[] {
  return punishments.flatMap((punishment) => [
    punishment,
    ...(punishment.children ? flattenPunishments(punishment.children) : []),
  ]);
}

export function getRandomPunishment(
  otherOwnPunishments: WOMPunishment[] = [],
  otherTeamPunishments: WOMPunishment[] = []
): WOMPunishment {
  // Determine blacklists
  const punishmentTextBlacklist = [
    ...flattenPunishments(otherOwnPunishments),
    ...flattenPunishments(otherTeamPunishments),
  ].map((item) => item.text);
  const punishmentTagBlacklist = [
    ...flattenPunishments(otherOwnPunishments),
    ...flattenPunishments(otherTeamPunishments).filter((item) => item.tags?.includes("team")),
  ].flatMap((item) => item.tags);

  // Get punishment lists
  const selectedPunishmentList = useWOMData.getState().selectedPunishmentList;
  const punishmentList =
    useWOMData
      .getState()
      .customPunishmentLists.find((list) => list.id === selectedPunishmentList) ??
    (DEFAULT_LIST as WOMPunishmentList);
  const weightedPunishmentList = punishmentList.punishments.flatMap((entry) =>
    Array<WOMPunishment>(entry.weight).fill(entry)
  );
  const noExtraSpinList = weightedPunishmentList.filter((entry) => !entry.extraSpins);

  // Randomize punishment
  let punishment: WOMPunishment;
  let attempts = 0;
  do {
    if (attempts >= 10) {
      punishment = {
        id: uuidv4(),
        text: "Nothing happens",
        weight: 1,
        extraSpins: 0,
        tags: [],
      };
      break;
    }
    punishment = {
      ...weightedPunishmentList[Math.floor(Math.random() * weightedPunishmentList.length)],
    };
    attempts++;
  } while (
    punishmentTextBlacklist.includes(punishment.text) ||
    punishmentTagBlacklist.some((tag) => punishment.tags?.includes(tag))
  );

  // If we got "Nothing happens", return early
  if (punishment.text === "Nothing happens") {
    return punishment;
  }

  // Adjust blacklists
  punishmentTextBlacklist.push(punishment.text);
  punishmentTagBlacklist.push(...punishment.tags);

  // Get extra spins
  for (let j = 0; j < punishment.extraSpins; j++) {
    // Randomize punishment
    let extraPunishment: WOMPunishment;
    attempts = 0;
    do {
      if (attempts >= 10) {
        extraPunishment = {
          id: uuidv4(),
          text: "Nothing extra happens",
          weight: 1,
          extraSpins: 0,
          tags: [],
        };
        break;
      }
      extraPunishment = {
        ...noExtraSpinList[Math.floor(Math.random() * noExtraSpinList.length)],
      };
      attempts++;
    } while (
      punishmentTextBlacklist.includes(extraPunishment.text) ||
      punishmentTagBlacklist.some((tag) => extraPunishment.tags?.includes(tag))
    );

    // Add the extra punishment to the main punishment
    if (!punishment.children) {
      punishment.children = [];
    }
    punishment.children.push(extraPunishment);

    // Adjust blacklists (only if we didn't get "Nothing extra happens")
    if (extraPunishment.text !== "Nothing extra happens") {
      punishmentTextBlacklist.push(extraPunishment.text);
      punishmentTagBlacklist.push(...extraPunishment.tags);
    }
  }

  return punishment;
}

export function getValidPunishmentListName(name: string) {
  const takenNames = useWOMData.getState().customPunishmentLists.map((list) => list.name);

  let proposedName = name;
  let i = 1;
  while (proposedName === "Default" || takenNames.includes(proposedName)) {
    proposedName = `${name} (${i})`;
    i++;
  }

  return proposedName;
}
