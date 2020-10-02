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

    let bestRefineResult: RefineResult;
    let bestRefineParamsId: string;

    for (const refineParams of refineParamsToTry) {
      const refineParamsId = getRefineParamsId(refineParams);

      const isInvalidHdParam = startingRefineLevel === currentRefineLevel
        && startingRefineLevel >= 7
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
        oreType: refineParams.oreType,
        refineResults,
        refineType,
        totalRefineResults,
        useBsb: refineParams.useBsb,
      });

      allRefineResults.set(refineParamsId, refineParamsResult);

      const previousUsedRefineResultSuccess = usedRefineResultSuccessMap.get(currentRefineLevel - 1);
      const previousUsedRefineConsumedMaterials = previousUsedRefineResultSuccess?.consumedMaterials ?? { baseItems: 1, ...createConsumedMaterialsBase() };
      const consumedItems = refineParamsResult.totalConsumedMaterials.items;

      let consumedMaterials: TotalConsumedMaterials;

      if (consumedItems) {
        const usedRefineResultSuccessForConsumedItem = usedRefineResultSuccessMap.get(consumedItems.refineLevel - 1);

        consumedMaterials = {
          baseItems: consumedItems.refineLevel !== currentRefineLevel
            ? previousUsedRefineConsumedMaterials.baseItems
              + usedRefineResultSuccessForConsumedItem.consumedMaterials.baseItems * consumedItems.amount
            : usedRefineResultSuccessForConsumedItem.consumedMaterials.baseItems * (consumedItems.amount + 1),
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            previousUsedRefineConsumedMaterials,
            multiplyConsumedMaterialsBase(
              usedRefineResultSuccessForConsumedItem.consumedMaterials,
              consumedItems.amount,
            ),
          ),
        };
      }
      else {
        consumedMaterials = {
          baseItems: previousUsedRefineConsumedMaterials.baseItems,
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            previousUsedRefineConsumedMaterials,
          ),
        };
      }

      allRefineParamsResults.set(refineParamsId, {
        consumedMaterials,
        cost: (previousUsedRefineResultSuccess?.cost ?? baseCost) + refineParamsResult.totalCost,
        id: refineParamsId,
        refineParams,
      });

      if (!bestRefineParamsId || refineParamsResult.totalCost < bestRefineResult.totalCost) {
        bestRefineParamsId = getRefineParamsId(refineParams);
        bestRefineResult = refineParamsResult;
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