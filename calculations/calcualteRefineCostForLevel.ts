import { RefineMaterial } from '../types/refineMaterial.type';
import { RefineResult } from '../types/refineResult.type';
import { TotalRefineResult } from '../types/totalRefineResult';
import { RefineType } from '../types/refineType.type';
import { refineCosts } from '../constants/refineCosts';
import { refineChances } from '../constants/refineChances';
import { Material } from '../types/material.type';
import { bsbAmountsNeeded } from '../constants/bsbAmountsNeeded';
import { ConsumedMaterials } from '../types/consumedMaterials.type';

const Cost: Record<Material, number> & Record<RefineMaterial, number> = {
  [RefineMaterial.Normal]: 5_000,
  [RefineMaterial.Enriched]: 500_000 + 5_000,
  [RefineMaterial.HD]: 1_000_000 + 500_000 + 5_000,
  [Material.BSB_Shard]: 1_800_000,
  [Material.BSB]: 1_800_000 * 2,
}

type Params = {
  readonly currentRefineLevel: number;
  readonly oreType: RefineMaterial;
  readonly refineResults: Map<number, RefineResult>;
  readonly totalRefineResults: Map<number, TotalRefineResult>;
  readonly refineType: RefineType;
  readonly useBsb: boolean;
}

export const calculateRefineCostForLevel = ({
  currentRefineLevel,
  oreType,
  refineResults,
  totalRefineResults,
  refineType,
  useBsb,
}: Params): RefineResult => {
  if (useBsb && currentRefineLevel < 7) {
    throw new Error('Can not use BSB below +7');
  }

  if (oreType === RefineMaterial.HD && currentRefineLevel < 7) {
    throw new Error('Can not use HD below +7');
  }

  const targetLevel = currentRefineLevel + 1;
  const previousRefineResult = refineResults.get(currentRefineLevel)
  const allTotalRefineResults = totalRefineResults.get(currentRefineLevel);
  const totalRefineResult = allTotalRefineResults.refineParamsResults.get(allTotalRefineResults.usedRefineParamsId);
  const oreCost = Cost[oreType];
  const refineCost = refineCosts[refineType];
  const chance = refineChances[refineType][oreType][currentRefineLevel];
  const bsbCost = Cost[Material.BSB];

  const refineAttempts = 100 / chance;

  if (useBsb) {
    const bsbAmount = bsbAmountsNeeded.get(currentRefineLevel);

    if (bsbAmount === undefined) {
      throw new Error('Unknown amount of BSB required from +' + currentRefineLevel + ' to +' + targetLevel);
    }

    const cost = (oreCost + refineCost + bsbAmount * bsbCost) * refineAttempts;
    const consumedMaterials: ConsumedMaterials = {
      normalOre: oreType === RefineMaterial.Normal ? refineAttempts : 0,
      enrichedOre: oreType === RefineMaterial.Enriched ? refineAttempts : 0,
      hdOre: oreType === RefineMaterial.HD ? refineAttempts : 0,
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
    case RefineMaterial.HD: {
      let cost = (oreCost + refineCost) * refineAttempts;
      // 1 less than average attempts per success
      const downgradedTimes = refineAttempts - 1;

      const log = (currentRefineLevel === 8);

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

    case RefineMaterial.Enriched:
    case RefineMaterial.Normal:
      return refineAttempts > 1
        ? {
          cost: (oreCost + refineCost) + (totalRefineResult.cost + oreCost + refineCost) * (refineAttempts - 1),
          consumedMaterials: {
            baseItemCount: refineAttempts,
            normalOre: oreType === RefineMaterial.Normal ? refineAttempts : 0,
            enrichedOre: oreType === RefineMaterial.Enriched ? refineAttempts : 0,
          },
          refineAttempts,
          refineLevel: targetLevel,
        }
        : {
          cost: (oreCost + refineCost) * refineAttempts,
          consumedMaterials: {
            normalOre: oreType === RefineMaterial.Normal ? 1 : 0,
            enrichedOre: oreType === RefineMaterial.Enriched ? 1 : 0,
          },
          refineAttempts,
          refineLevel: targetLevel,
        };

      throw new Error('Something is not implemented');
  }

  throw new Error('Something is not implemented');
};