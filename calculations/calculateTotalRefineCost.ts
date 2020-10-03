import {
  addConsumedMaterialsBase, createConsumedMaterialsBase,
  multiplyConsumedMaterialsBase, TotalConsumedMaterials,
} from '../types/consumedMaterials.type';
import { generateRefineParams } from '../utils/generateRefineParams';
import { OreType } from '../types/oreType.type';
import { calculateRefineCostForLevel } from './calculateRefineCostForLevel';
import {
  RefineParamsResultError,
  RefineParamsResultSuccess,
  TotalRefineResult,
} from '../types/totalRefineResult.type';
import { getRefineParamsId } from '../utils/getRefineParamsId';
import { RefineType } from '../types/refineType.type';
import { RefineResult } from '../types/refineResult.type';
import { isOreRefineParameters } from '../types/RefineParameters.type';

type Params = {
  readonly baseCost: number;
  readonly itemCosts: Map<number, number>;
  readonly refineType?: RefineType,
  readonly startingRefineLevel?: number,
  readonly targetRefineLevel?: number,
  readonly refineParamsPreferences: Map<number, string>;
};

export type TotalRefineCostResult = {
  readonly refineResults: readonly RefineResult[];
  readonly totalRefineResults: readonly TotalRefineResult[];
}

export const calculateTotalRefineCost = ({
  baseCost,
  itemCosts,
  refineParamsPreferences,
  refineType,
  startingRefineLevel,
  targetRefineLevel,
}: Params): TotalRefineCostResult => {
  const refineResults: Map<number, RefineResult> = new Map<number, RefineResult>();
  const totalRefineResults: Map<number, TotalRefineResult> = new Map<number, TotalRefineResult>();

  let currentRefineLevel = startingRefineLevel;
  const usedRefineResultSuccessMap: Map<number, RefineParamsResultSuccess> = new Map<number, RefineParamsResultSuccess>();

  do {
    let refineParamsToTry = generateRefineParams(currentRefineLevel + 1);

    const allRefineParamsResults: Map<string, RefineParamsResultSuccess> = new Map<string, RefineParamsResultSuccess>();
    const allRefineParamsErrors: Map<string, RefineParamsResultError> = new Map<string, RefineParamsResultError>();
    const allRefineResults: Map<string, RefineResult> = new Map<string, RefineResult>();

    let bestRefineTotalCost: number;
    let bestRefineParamsId: string;

    for (const refineParams of refineParamsToTry) {
      const refineParamsId = getRefineParamsId(refineParams);

      const isInvalidHdParam = startingRefineLevel === currentRefineLevel
        && startingRefineLevel >= 7
        && isOreRefineParameters(refineParams)
        && refineParams.oreType === OreType.HD;

      if (isInvalidHdParam) {
        // Remove HD because we can't precisely calculate the cost refining downgraded item to continue
        allRefineParamsErrors.set(refineParamsId, {
          id: refineParamsId,
          refineParams,
          message: `Can not precisely calculate the HD cost because of missing information about refine cost of +${currentRefineLevel
          - 1}`,
        })

        continue;
      }

      const refineParamsResult = calculateRefineCostForLevel({
        baseCost,
        currentRefineLevel,
        itemCosts,
        refineParams,
        refineResults,
        refineType,
        totalRefineResults,
      });

      allRefineResults.set(refineParamsId, refineParamsResult);

      const previousUsedRefineResultSuccess = usedRefineResultSuccessMap.get(currentRefineLevel - 1);
      const previousUsedRefineConsumedMaterials = previousUsedRefineResultSuccess?.totalConsumedMaterials ?? { baseItems: 1, ...createConsumedMaterialsBase() };
      const consumedItems = refineParamsResult.totalConsumedMaterials.items;

      let totalConsumedMaterials: TotalConsumedMaterials;
      let refineConsumedMaterials: TotalConsumedMaterials;
      let totalCost: number;

      if (consumedItems) {
        const usedRefineResultSuccessForConsumedItem = usedRefineResultSuccessMap.get(consumedItems.refineLevel - 1);

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

        totalCost = (previousUsedRefineResultSuccess?.totalCost ?? baseCost) + refineParamsResult.totalCost;
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

          totalCost = (previousUsedRefineResultSuccess?.totalCost ?? baseCost) + refineParamsResult.totalCost;
        }
        else {
          refineConsumedMaterials = {
            baseItems: 0,
            ...refineParamsResult.totalConsumedMaterials,
          };

          totalConsumedMaterials = refineConsumedMaterials;
          totalCost = baseCost + refineParamsResult.totalCost;
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
    usedRefineResultSuccessMap.set(currentRefineLevel, usedRefineResultSuccess);

    currentRefineLevel++;

    refineResults.set(currentRefineLevel, allRefineResults.get(usedRefineResultSuccess.id));
    totalRefineResults.set(currentRefineLevel, {
      usedRefineParamsId: usedRefineResultSuccess.id,
      bestRefineParamsId,
      refineParamsResults: allRefineParamsResults,
      refineParamsErrors: allRefineParamsErrors,
      refineLevel: currentRefineLevel,
    });
  } while (currentRefineLevel < targetRefineLevel);

  return {
    refineResults: [...refineResults.values()],
    totalRefineResults: [...totalRefineResults.values()],
  };
};