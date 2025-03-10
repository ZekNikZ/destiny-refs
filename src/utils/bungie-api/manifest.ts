import { useBungieQuery } from "./helpers";

export interface BungieManifest {
  Response: {
    version: string;
    jsonWorldComponentContentPaths: {
      en: {
        DestinyArtDyeChannelDefinition: string;
        DestinyArtDyeReferenceDefinition: string;
        DestinyPlaceDefinition: string;
        DestinyActivityDefinition: string;
        DestinyActivityTypeDefinition: string;
        DestinyClassDefinition: string;
        DestinyGenderDefinition: string;
        DestinyInventoryBucketDefinition: string;
        DestinyRaceDefinition: string;
        DestinyUnlockDefinition: string;
        DestinyStatGroupDefinition: string;
        DestinyProgressionMappingDefinition: string;
        DestinyFactionDefinition: string;
        DestinyVendorGroupDefinition: string;
        DestinyRewardSourceDefinition: string;
        DestinyUnlockValueDefinition: string;
        DestinyRewardMappingDefinition: string;
        DestinyRewardSheetDefinition: string;
        DestinyItemCategoryDefinition: string;
        DestinyDamageTypeDefinition: string;
        DestinyActivityModeDefinition: string;
        DestinyMedalTierDefinition: string;
        DestinyAchievementDefinition: string;
        DestinyActivityGraphDefinition: string;
        DestinyActivityInteractableDefinition: string;
        DestinyBondDefinition: string;
        DestinyCharacterCustomizationCategoryDefinition: string;
        DestinyCharacterCustomizationOptionDefinition: string;
        DestinyCollectibleDefinition: string;
        DestinyDestinationDefinition: string;
        DestinyEntitlementOfferDefinition: string;
        DestinyEquipmentSlotDefinition: string;
        DestinyEventCardDefinition: string;
        DestinyFireteamFinderActivityGraphDefinition: string;
        DestinyFireteamFinderActivitySetDefinition: string;
        DestinyFireteamFinderLabelDefinition: string;
        DestinyFireteamFinderLabelGroupDefinition: string;
        DestinyFireteamFinderOptionDefinition: string;
        DestinyFireteamFinderOptionGroupDefinition: string;
        DestinyStatDefinition: string;
        DestinyInventoryItemDefinition: string;
        DestinyInventoryItemLiteDefinition: string;
        DestinyItemTierTypeDefinition: string;
        DestinyLoadoutColorDefinition: string;
        DestinyLoadoutIconDefinition: string;
        DestinyLoadoutNameDefinition: string;
        DestinyLocationDefinition: string;
        DestinyLoreDefinition: string;
        DestinyMaterialRequirementSetDefinition: string;
        DestinyMetricDefinition: string;
        DestinyObjectiveDefinition: string;
        DestinySandboxPerkDefinition: string;
        DestinyPlatformBucketMappingDefinition: string;
        DestinyPlugSetDefinition: string;
        DestinyPowerCapDefinition: string;
        DestinyPresentationNodeDefinition: string;
        DestinyProgressionDefinition: string;
        DestinyProgressionLevelRequirementDefinition: string;
        DestinyRecordDefinition: string;
        DestinyRewardAdjusterPointerDefinition: string;
        DestinyRewardAdjusterProgressionMapDefinition: string;
        DestinyRewardItemListDefinition: string;
        DestinySackRewardItemListDefinition: string;
        DestinySandboxPatternDefinition: string;
        DestinySeasonDefinition: string;
        DestinySeasonPassDefinition: string;
        DestinySocialCommendationDefinition: string;
        DestinySocketCategoryDefinition: string;
        DestinySocketTypeDefinition: string;
        DestinyTraitDefinition: string;
        DestinyUnlockCountMappingDefinition: string;
        DestinyUnlockEventDefinition: string;
        DestinyUnlockExpressionMappingDefinition: string;
        DestinyVendorDefinition: string;
        DestinyMilestoneDefinition: string;
        DestinyActivityModifierDefinition: string;
        DestinyReportReasonCategoryDefinition: string;
        DestinyArtifactDefinition: string;
        DestinyBreakerTypeDefinition: string;
        DestinyChecklistDefinition: string;
        DestinyEnergyTypeDefinition: string;
        DestinySocialCommendationNodeDefinition: string;
        DestinyGuardianRankDefinition: string;
        DestinyGuardianRankConstantsDefinition: string;
        DestinyLoadoutConstantsDefinition: string;
        DestinyFireteamFinderConstantsDefinition: string;
        DestinyGlobalConstantsDefinition: string;
      };
    };
  };
}

export function useBungieManifest() {
  return useBungieQuery<BungieManifest>("/Platform/Destiny2/Manifest/");
}
