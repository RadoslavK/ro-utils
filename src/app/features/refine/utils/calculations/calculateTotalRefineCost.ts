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

  return {
    refineResults: [...refineResults.values()],
    totalRefineResults: [...totalRefineResults.values()],
  };
};