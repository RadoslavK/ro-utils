import {
  addConsumedMaterials,
  createConsumedMaterials,
  mergeItemsOfRefine,
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

  let totalCost = baseCost;
  let totalConsumedMaterials = createConsumedMaterials();
  let currentRefineLevel = startingRefineLevel;

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

      allRefineParamsResults.set(refineParamsId, {
        id: refineParamsId,
        consumedMaterials: {
          itemsOfRefine: mergeItemsOfRefine(totalConsumedMaterials.itemsOfRefine,  refineParamsResult.totalConsumedMaterials.itemsOfRefine),
          ...addConsumedMaterials(
            {
              itemsOfRefine: new Map<number, number>(),
              ...totalConsumedMaterials,
            },
            refineParamsResult.totalConsumedMaterials,
          ),
        },
        cost: totalCost + refineParamsResult.totalCost,
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

    const usedRefineResult = allRefineParamsResults.get(usedRefineParamsId);

    totalCost = usedRefineResult.cost;
    totalConsumedMaterials = usedRefineResult.consumedMaterials;

    currentRefineLevel++;

    refineResults.set(currentRefineLevel, allRefineResults.get(usedRefineResult.id));
    totalRefineResults.set(currentRefineLevel, {
      usedRefineParamsId: usedRefineResult.id,
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