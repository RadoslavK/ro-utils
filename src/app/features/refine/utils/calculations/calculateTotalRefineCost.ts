import {
  addConsumedMaterialsBase, createConsumedMaterialsBase,
  multiplyConsumedMaterialsBase, TotalConsumedMaterials,
} from '../../types/consumedMaterials.type';
import { generateRefineParams } from './generateRefineParams';
import { calculateRefineCostForLevel } from './calculateRefineCostForLevel';
import {
  RefineParamsResult,
  TotalRefineResult,
} from '../../types/totalRefineResult.type';
import { getRefineParamsId } from './getRefineParamsId';
import { RefineResult } from '../../types/refineResult.type';
import { isOreRefineParameters } from '../../types/RefineParameters.type';
import { RefineInput } from '../../types/refineInput.type';

type Params = {
  readonly itemCosts: Map<number, number>;
  readonly refineInput: RefineInput;
  readonly refineParamsPreferences: Map<number, string>;
};

export type TotalRefineCostResult = {
  readonly refineResults: readonly RefineResult[];
  readonly totalRefineResults: readonly TotalRefineResult[];
}

export const calculateTotalRefineCost = ({
  itemCosts,
  refineInput,
  refineParamsPreferences,
}: Params): TotalRefineCostResult => {
  const {
    baseItemCost,
    refineType,
    startingRefineLevel,
    targetRefineLevel,
  } = refineInput;

  const refineResults: Map<number, RefineResult> = new Map<number, RefineResult>();
  const totalRefineResults: Map<number, TotalRefineResult> = new Map<number, TotalRefineResult>();

  let currentRefineLevel = 0;
  const usedRefineResultsMap: Map<number, RefineParamsResult> = new Map<number, RefineParamsResult>();

  do {
    const refineParamsToTry = generateRefineParams(currentRefineLevel + 1);

    const allRefineParamsResults: Map<string, RefineParamsResult> = new Map<string, RefineParamsResult>();
    const allRefineResults: Map<string, RefineResult> = new Map<string, RefineResult>();

    let bestRefineTotalCost: number;
    let bestRefineParamsId: string;

    for (const refineParams of refineParamsToTry) {
      const refineParamsId = getRefineParamsId(refineParams);

      const refineParamsResult = calculateRefineCostForLevel({
        currentRefineLevel,
        itemCosts,
        baseItemCost,
        refineParams,
        refineResults,
        refineType,
        totalRefineResults,
      });

      allRefineResults.set(refineParamsId, refineParamsResult);

      const previousUsedRefineResultSuccess = usedRefineResultsMap.get(currentRefineLevel - 1);
      const previousUsedRefineConsumedMaterials = previousUsedRefineResultSuccess?.totalConsumedMaterials ?? { baseItems: 1, ...createConsumedMaterialsBase() };
      const consumedItems = refineParamsResult.totalConsumedMaterials.items;

      let totalConsumedMaterials: TotalConsumedMaterials;
      let refineConsumedMaterials: TotalConsumedMaterials;
      let totalCost: number;

      if (consumedItems) {
        const usedRefineResultSuccessForConsumedItem = usedRefineResultsMap.get(consumedItems.refineLevel - 1);

        refineConsumedMaterials = {
          baseItems: usedRefineResultSuccessForConsumedItem.totalConsumedMaterials.baseItems * consumedItems.amount,
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            multiplyConsumedMaterialsBase(
              usedRefineResultSuccessForConsumedItem.totalConsumedMaterials,
              consumedItems.amount,
            ),
          ),
        };

        totalConsumedMaterials = {
          baseItems: consumedItems.refineLevel !== currentRefineLevel
            ? previousUsedRefineConsumedMaterials.baseItems
              + usedRefineResultSuccessForConsumedItem.totalConsumedMaterials.baseItems * consumedItems.amount
            : usedRefineResultSuccessForConsumedItem.totalConsumedMaterials.baseItems * (consumedItems.amount + 1),
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            previousUsedRefineConsumedMaterials,
            multiplyConsumedMaterialsBase(
              usedRefineResultSuccessForConsumedItem.totalConsumedMaterials,
              consumedItems.amount,
            ),
          ),
        };

        totalCost = (previousUsedRefineResultSuccess?.totalCost ?? baseItemCost) + refineParamsResult.totalCost;
      }
      else {
        if (isOreRefineParameters(refineParams)) {
          refineConsumedMaterials = {
            baseItems: 0,
            ...refineParamsResult.totalConsumedMaterials,
          };

          totalConsumedMaterials = {
            baseItems: previousUsedRefineConsumedMaterials.baseItems,
            ...addConsumedMaterialsBase(
              refineParamsResult.totalConsumedMaterials,
              previousUsedRefineConsumedMaterials,
            ),
          };

          totalCost = (previousUsedRefineResultSuccess?.totalCost ?? baseItemCost) + refineParamsResult.totalCost;
        }
        else {
          refineConsumedMaterials = {
            baseItems: 0,
            ...refineParamsResult.totalConsumedMaterials,
          };

          totalConsumedMaterials = refineConsumedMaterials;

          //  We need to apply the cost of item at current refine
          //  Otherwise it could get misleading results for using refine box for it
          const startingRefineLevelResult = totalRefineResults.get(startingRefineLevel);
          const startingRefineLevelBaseCost = startingRefineLevelResult?.refineParamsResults
              ?.get(startingRefineLevelResult?.usedRefineParamsId)?.totalCost
                ?? baseItemCost;

          totalCost = startingRefineLevelBaseCost + refineParamsResult.totalCost;
        }
      }

      allRefineParamsResults.set(refineParamsId, {
        totalConsumedMaterials: totalConsumedMaterials,
        totalCost,
        refineConsumedMaterials: refineConsumedMaterials,
        refineCost: refineParamsResult.totalCost,
        id: refineParamsId,
        refineParams,
      });

      if (!bestRefineParamsId || totalCost < bestRefineTotalCost) {
        bestRefineParamsId = getRefineParamsId(refineParams);
        bestRefineTotalCost = totalCost;
      }
    }

    const preferredRefineParamsId = refineParamsPreferences.get(currentRefineLevel + 1);
    const usedRefineParamsId = preferredRefineParamsId !== undefined
      ? preferredRefineParamsId
      : bestRefineParamsId;

    const usedRefineResultSuccess = allRefineParamsResults.get(usedRefineParamsId);
    usedRefineResultsMap.set(currentRefineLevel, usedRefineResultSuccess);

    currentRefineLevel++;

    refineResults.set(currentRefineLevel, allRefineResults.get(usedRefineResultSuccess.id));
    totalRefineResults.set(currentRefineLevel, {
      usedRefineParamsId: usedRefineResultSuccess.id,
      bestRefineParamsId,
      refineParamsResults: allRefineParamsResults,
      refineLevel: currentRefineLevel,
    });
  } while (currentRefineLevel < targetRefineLevel);

  if (startingRefineLevel === 0) {
    return {
      refineResults: [...refineResults.values()],
      totalRefineResults: [...totalRefineResults.values()],
    };
  }

  const startingRefineTotalRefineResults = totalRefineResults.get(startingRefineLevel);
  const startingRefineUsedResults = startingRefineTotalRefineResults.refineParamsResults.get(startingRefineTotalRefineResults.usedRefineParamsId);

  const totalRefineResultsFromStartingRefine = [...totalRefineResults
    .entries()]
    .reduce((reduced, [key, value]) => {
      if (key <= startingRefineLevel) {
        reduced.set(key, value);

        return reduced;
      }

      //  The original object contains total consumed materials if we refined from scratch
      //  But we need to reflect the starting refine
      const correctedConsumedMaterials: TotalRefineResult = {
        ...value,
        refineParamsResults: [...value.refineParamsResults.entries()].reduce((reduced2, [key2, value2]) => {
          const correctedResult: RefineParamsResult = {
            ...value2,
            totalCost: value2.totalCost - startingRefineUsedResults.totalCost,
            totalConsumedMaterials: {
              baseItems: value2.totalConsumedMaterials.baseItems - startingRefineUsedResults.totalConsumedMaterials.baseItems,
              bsb: value2.totalConsumedMaterials.bsb - startingRefineUsedResults.totalConsumedMaterials.bsb,
              enrichedOre: value2.totalConsumedMaterials.enrichedOre - startingRefineUsedResults.totalConsumedMaterials.enrichedOre,
              hdOre: value2.totalConsumedMaterials.hdOre - startingRefineUsedResults.totalConsumedMaterials.hdOre,
              normalOre: value2.totalConsumedMaterials.normalOre - startingRefineUsedResults.totalConsumedMaterials.normalOre,
              refineBox: value2.totalConsumedMaterials.refineBox - startingRefineUsedResults.totalConsumedMaterials.refineBox,
            },
          };

          reduced2.set(key2, correctedResult);

          return reduced2;
        }, new Map<string, RefineParamsResult>()),
      };

      reduced.set(key, correctedConsumedMaterials);

      return reduced;
    }, new Map<number, TotalRefineResult>());

  return {
    refineResults: [...refineResults.values()],
    totalRefineResults: [...totalRefineResultsFromStartingRefine.values()],
  };
};