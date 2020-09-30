import { OreType } from '../types/oreType.type';
import { RefineType } from '../types/refineType.type';
import { TotalRefineResult } from '../types/totalRefineResult.type';
import { refineItemIds } from '../app/refine/components/Costs';
import { refineChances } from '../constants/refineChances';
import { getRefineCost } from '../utils/getRefineCost';
import { bsbAmountsNeeded } from '../constants/bsbAmountsNeeded';
import {
  addConsumedMaterials,
  ConsumedMaterials,
  createConsumedMaterials,
  multiplyConsumedMaterials,
} from '../types/consumedMaterials.type';
import { getOreId } from '../utils/getOreId';
import { RefineResult } from '../types/refineResult.type';

type Params = {
  readonly baseCost: number;
  readonly currentRefineLevel: number;
  readonly itemCosts: Map<number, number>;
  readonly oreType: OreType;
  readonly refineResults: Map<number, RefineResult>;
  readonly refineType: RefineType;
  readonly totalRefineResults: Map<number, TotalRefineResult>;
  readonly useBsb: boolean;
}

const getUsedOreKey = (ore: OreType): keyof ConsumedMaterials => {
  switch (ore) {
    case OreType.Normal: return 'normalOre';
    case OreType.Enriched: return 'enrichedOre';
    case OreType.HD: return 'hdOre';
    default: throw new Error(`Unknown ore type: ${ore}`);
  }
}

export const calculateRefineCostForLevel = ({
  baseCost,
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
  const allTotalRefineResults = totalRefineResults.get(currentRefineLevel);
  const totalRefineResult = allTotalRefineResults?.refineParamsResults?.get(allTotalRefineResults.usedRefineParamsId);
  const oreCost = itemCosts.get(oreId);
  const refineCost = getRefineCost(refineType, oreType);
  const chance = refineChances[refineType][oreType][currentRefineLevel];
  const bsbCost = itemCosts.get(refineItemIds.BlacksmithBlessing);

  if (oreCost === undefined) {
    throw new Error(`Cost for item with it: ${oreId} is missing`);
  }

  const refineAttempts = 100 / chance;

  const usedOreKey = getUsedOreKey(oreType);

  if (useBsb) {
    const bsbAmount = bsbAmountsNeeded.get(currentRefineLevel);

    if (bsbAmount === undefined) {
      throw new Error('Unknown amount of BSB required from +' + currentRefineLevel + ' to +' + targetLevel);
    }

    const attemptCost = oreCost + refineCost + bsbAmount * bsbCost;
    const totalCost = attemptCost * refineAttempts;

    const attemptConsumedMaterials = createConsumedMaterials({
      [usedOreKey]: 1,
      bsb: bsbAmount,
    })
    const totalConsumedMaterials = multiplyConsumedMaterials(attemptConsumedMaterials, refineAttempts);

    return {
      attemptConsumedMaterials,
      attemptCost,
      downgradedTimes: 0,
      refineAttempts,
      refineLevel: targetLevel,
      totalConsumedMaterials,
      totalCost,
    };
  }

  switch (oreType) {
    case OreType.HD: {
      const attemptCost = oreCost + refineCost;

      const attemptConsumedMaterials = createConsumedMaterials({
        hdOre: 1,
      });

      if (refineAttempts > 1) {
        // 1 less than average attempts per success
        const originalDowngradedTimes = refineAttempts - 1;
        let downgradedTimes = originalDowngradedTimes;
        let totalCost = attemptCost * refineAttempts;

        let downgradedRefineLevel = currentRefineLevel;

        let consumedMaterialsForDowngradedAttempts = createConsumedMaterials();

        // calculate cost of all downgraded attempts.. e.g. +8 -> +7 -> +6...
        do {
          const previousRefineResult = refineResults.get(downgradedRefineLevel);
          const attemptsNeededToGetToOriginalLevelAgain = downgradedTimes * previousRefineResult.refineAttempts;
          const allPreviousRefineTotalResults = totalRefineResults.get(downgradedRefineLevel - 1);

          const totalRefineResultOfUsedPreviousRefine = allPreviousRefineTotalResults?.refineParamsResults?.get(allPreviousRefineTotalResults.usedRefineParamsId);

          //  In case they broke
          //  If it downgraded or uses BSB it could not break
          const extraPreviousItemsNeeded = (previousRefineResult.attemptConsumedMaterials.hdOre > 0 || previousRefineResult.attemptConsumedMaterials.bsb > 0)
            ? 0
            : attemptsNeededToGetToOriginalLevelAgain - downgradedTimes;

          totalCost += attemptsNeededToGetToOriginalLevelAgain * previousRefineResult.attemptCost;
          totalCost += extraPreviousItemsNeeded * (totalRefineResultOfUsedPreviousRefine ? totalRefineResultOfUsedPreviousRefine.cost : baseCost);

          downgradedRefineLevel--;
          downgradedTimes = previousRefineResult.attemptConsumedMaterials.hdOre > 0
            ? attemptsNeededToGetToOriginalLevelAgain - downgradedTimes
            : 0;

          consumedMaterialsForDowngradedAttempts = addConsumedMaterials(
            consumedMaterialsForDowngradedAttempts,
            multiplyConsumedMaterials(
              previousRefineResult.attemptConsumedMaterials,
              attemptsNeededToGetToOriginalLevelAgain,
            ),
            createConsumedMaterials({
              itemsOfRefine: extraPreviousItemsNeeded
                ? new Map<number, number>([
                  [downgradedRefineLevel, extraPreviousItemsNeeded],
                ])
                : new Map<number, number>(),
            }),
          );
        } while (downgradedTimes > 0);

        const totalConsumedMaterials = addConsumedMaterials(
          multiplyConsumedMaterials(attemptConsumedMaterials, refineAttempts),
          consumedMaterialsForDowngradedAttempts,
        );

        return {
          attemptConsumedMaterials,
          attemptCost,
          downgradedTimes: originalDowngradedTimes,
          refineAttempts,
          refineLevel: targetLevel,
          totalConsumedMaterials,
          totalCost,
        };
      }
      else {
        return {
          attemptConsumedMaterials,
          attemptCost,
          downgradedTimes: 0,
          refineAttempts,
          refineLevel: targetLevel,
          totalConsumedMaterials: attemptConsumedMaterials,
          totalCost: attemptCost,
        };
      }
    }

    case OreType.Enriched:
    case OreType.Normal: {
      const attemptCost = oreCost + refineCost;
      const attemptConsumedMaterials = createConsumedMaterials({
        [usedOreKey]: 1,
      })

      if (refineAttempts > 1) {
        const lostItemCost = totalRefineResult ? totalRefineResult.cost : baseCost;
        const lostItemsCount = refineAttempts - 1;
        const totalCost = attemptCost * refineAttempts + lostItemCost * lostItemsCount;

        const totalConsumedMaterials = addConsumedMaterials(
          multiplyConsumedMaterials(attemptConsumedMaterials, refineAttempts),
          createConsumedMaterials({
            itemsOfRefine: new Map<number, number>([
              [currentRefineLevel, lostItemsCount],
            ]),
          }),
        );

        return {
          attemptCost,
          downgradedTimes: 0,
          totalConsumedMaterials,
          attemptConsumedMaterials,
          totalCost,
          refineAttempts,
          refineLevel: targetLevel,
        }
      }
      else {
        return {
          attemptConsumedMaterials,
          attemptCost,
          downgradedTimes: 0,
          refineAttempts: 1,
          refineLevel: targetLevel,
          totalConsumedMaterials: attemptConsumedMaterials,
          totalCost: attemptCost,
        }
      }
    }

    default:
      throw new Error(`Unknown ore type: ${oreType}`);
  }
};