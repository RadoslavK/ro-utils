import { RefineResult } from '../types/refineResult.type';
import { TotalRefineResult } from '../types/totalRefineResult';
import { RefineType } from '../types/refineType.type';
import { refineCosts } from '../constants/refineCosts';
import { refineChances } from '../constants/refineChances';
import { bsbAmountsNeeded } from '../constants/bsbAmountsNeeded';
import { ConsumedMaterials } from '../types/consumedMaterials.type';
import { refineItemIds } from '../app/refine/components/Costs';
import { OreType } from '../types/oreType.type';

type Params = {
  readonly currentRefineLevel: number;
  readonly itemCosts: Map<number, number>;
  readonly oreType: OreType;
  readonly refineResults: Map<number, RefineResult>;
  readonly refineType: RefineType;
  readonly totalRefineResults: Map<number, TotalRefineResult>;
  readonly useBsb: boolean;
}

const getOreId = (oreType: OreType, refineType: RefineType): number => {
  switch (oreType) {
    case OreType.Normal:
      switch (refineType) {
        case RefineType.Armor:
          return refineItemIds.Elunium;
        case RefineType.Weapon1:
          return refineItemIds.Phracon;
        case RefineType.Weapon2:
          return refineItemIds.Emveretarcon;
        case RefineType.Weapon3:
        case RefineType.Weapon4:
          return refineItemIds.Oridecon;

        default:
          throw new Error(`Unknown refine type: ${refineType}`);

      }

    case OreType.Enriched:
      return refineType === RefineType.Armor
        ? refineItemIds.EnrichedElunium
        : refineItemIds.EnrichedOridecon;

    case OreType.HD:
      return refineType === RefineType.Armor
        ? refineItemIds.HDElunium
        : refineItemIds.HDOridecon;

    default:
      throw new Error(`Unknown ore type: ${oreType}`);
  }
}

export const calculateRefineCostForLevel = ({
  currentRefineLevel,
  itemCosts,
  oreType,
  refineResults,
  refineType,
  totalRefineResults,
  useBsb,
}: Params): RefineResult => {
  if (useBsb && currentRefineLevel < 7) {
    throw new Error('Can not use BSB below +7');
  }

  if (oreType === OreType.HD && currentRefineLevel < 7) {
    throw new Error('Can not use HD below +7');
  }

  const oreId = getOreId(oreType, refineType);

  const targetLevel = currentRefineLevel + 1;
  const previousRefineResult = refineResults.get(currentRefineLevel)
  const allTotalRefineResults = totalRefineResults.get(currentRefineLevel);
  const totalRefineResult = allTotalRefineResults.refineParamsResults.get(allTotalRefineResults.usedRefineParamsId);
  const oreCost = itemCosts.get(oreId);
  const refineCost = refineCosts[refineType];
  const chance = refineChances[refineType][oreType][currentRefineLevel];
  const bsbCost = itemCosts.get(refineItemIds.BlacksmithBlessing);

  if (oreCost === undefined) {
    throw new Error(`Cost for item with it: ${oreId} is missing`);
  }

  const refineAttempts = 100 / chance;

  if (useBsb) {
    const bsbAmount = bsbAmountsNeeded.get(currentRefineLevel);

    if (bsbAmount === undefined) {
      throw new Error('Unknown amount of BSB required from +' + currentRefineLevel + ' to +' + targetLevel);
    }

    const cost = (oreCost + refineCost + bsbAmount * bsbCost) * refineAttempts;
    const consumedMaterials: ConsumedMaterials = {
      normalOre: oreType === OreType.Normal ? refineAttempts : 0,
      enrichedOre: oreType === OreType.Enriched ? refineAttempts : 0,
      hdOre: oreType === OreType.HD ? refineAttempts : 0,
      bsb: bsbAmount * refineAttempts,
    };

    return {
      consumedMaterials,
      cost,
      refineAttempts,
      refineLevel: targetLevel,
    };
  }

  switch (oreType) {
    case OreType.HD: {
      let cost = (oreCost + refineCost) * refineAttempts;
      // 1 less than average attempts per success
      const downgradedTimes = refineAttempts - 1;

      let consumedMaterials: ConsumedMaterials;

      if (downgradedTimes > 0) {
        const attemptsNeededToGetToOriginalLevelAgain = downgradedTimes * previousRefineResult.refineAttempts;
        const allPreviousRefineTotalResults = totalRefineResults.get(currentRefineLevel - 1);
        const totalRefineResultOfUsedPreviousRefine = allPreviousRefineTotalResults.refineParamsResults.get(allPreviousRefineTotalResults.usedRefineParamsId);

        //  In case they broke
        const extraPreviousItemsNeeded = (previousRefineResult.consumedMaterials.baseItemCount || 0) > 0
          ? attemptsNeededToGetToOriginalLevelAgain - downgradedTimes
          : 0

        //  previousRefineResult.refineAttempts are calculated in the previous cost already
        const previousRefineCostsMultiplier = (attemptsNeededToGetToOriginalLevelAgain / previousRefineResult.refineAttempts);

        cost += previousRefineCostsMultiplier * previousRefineResult.cost;
        cost += extraPreviousItemsNeeded * totalRefineResultOfUsedPreviousRefine.cost;

        const previousRefineConsumedMaterials = previousRefineResult.consumedMaterials;

        consumedMaterials = {
          bsb: (previousRefineConsumedMaterials.bsb || 0) * previousRefineCostsMultiplier,
          //  TODO how should we calculate baseItemCount here?
          baseItemCount: extraPreviousItemsNeeded,
          normalOre: (previousRefineConsumedMaterials.normalOre || 0) * previousRefineCostsMultiplier,
          enrichedOre: (previousRefineConsumedMaterials.enrichedOre || 0) * previousRefineCostsMultiplier,
          hdOre: refineAttempts + (previousRefineConsumedMaterials.hdOre || 0) * previousRefineCostsMultiplier,
        };
      }
      else {
        consumedMaterials = {
          hdOre: refineAttempts,
        };
      }

      return {
        consumedMaterials,
        cost,
        downgradedTimes,
        refineAttempts,
        refineLevel: targetLevel,
      };
    }

    case OreType.Enriched:
    case OreType.Normal:
      return refineAttempts > 1
        ? {
          cost: (oreCost + refineCost) + (totalRefineResult.cost + oreCost + refineCost) * (refineAttempts - 1),
          consumedMaterials: {
            baseItemCount: refineAttempts,
            normalOre: oreType === OreType.Normal ? refineAttempts : 0,
            enrichedOre: oreType === OreType.Enriched ? refineAttempts : 0,
          },
          refineAttempts,
          refineLevel: targetLevel,
        }
        : {
          cost: (oreCost + refineCost) * refineAttempts,
          consumedMaterials: {
            normalOre: oreType === OreType.Normal ? 1 : 0,
            enrichedOre: oreType === OreType.Enriched ? 1 : 0,
          },
          refineAttempts,
          refineLevel: targetLevel,
        };

      throw new Error('Something is not implemented');
  }

  throw new Error('Something is not implemented');
};