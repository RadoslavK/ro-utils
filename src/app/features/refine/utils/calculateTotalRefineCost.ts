import {
  addConsumedMaterialsBase, addItems, ConsumedMaterials, createConsumedMaterials,
  multiplyConsumedMaterialsBase, multiplyItems,
} from '../types/consumedMaterials.type';
import { generateOreRefineParams } from './generateOreRefineParams';
import { calculateRefineCostForLevel } from './calculateRefineCostForLevel';
import {
  RefineParamsResult,
  TotalRefineResult,
} from '../types/totalRefineResult.type';
import { getRefineParamsId } from './getRefineParamsId';
import { RefineResult } from '../types/refineResult.type';
import { RefineType } from '../types/refineType.type';
import memoizee from 'memoizee';

const calculateTotalRefineCostMemoized = memoizee((
  baseItemCost: number,
  itemCosts: Map<number, number>,
  refineParamsPreferences: Map<number, string> | undefined = new Map<number, string>(),
  refineType: RefineType,
  startingRefineLevel: number | undefined = 0,
  targetRefineLevel: number,
  totalRefineResults: Map<number, TotalRefineResult> | undefined = new Map<number, TotalRefineResult>(),
  usedRefineResultsMap: Map<number, RefineParamsResult> | undefined = new Map<number, RefineParamsResult>(),
): readonly TotalRefineResult[] => {
  if (startingRefineLevel !== undefined && totalRefineResults === undefined && usedRefineResultsMap === undefined) {
    throw new Error('Provide totalRefineResults and usedRefineResultsMap when using custom starting refine level');
  }

  const refineResults: Map<number, RefineResult> = new Map<number, RefineResult>();

  let currentRefineLevel = startingRefineLevel;

  while (currentRefineLevel < targetRefineLevel) {
    const oreRefineParamsToTry = generateOreRefineParams(currentRefineLevel + 1, startingRefineLevel);

    const allRefineParamsResults: Map<string, RefineParamsResult> = new Map<string, RefineParamsResult>();
    const allRefineResults: Map<string, RefineResult> = new Map<string, RefineResult>();

    let bestRefineItemTotalCost: number;
    let bestRefineParamsId: string;

    const usedTotalItemCosts = [...totalRefineResults.entries()]
      .reduce((reduced, [key, result]) => {
        reduced.set(key, result.refineParamsResults.get(result.usedRefineParamsId).totalItemCost);

        return reduced;
      }, new Map<number, number>());

    for (const refineParams of oreRefineParamsToTry) {
      const refineParamsId = getRefineParamsId(refineParams);

      const refineParamsResult = calculateRefineCostForLevel({
        currentRefineLevel,
        itemCosts,
        baseItemCost,
        refineParams,
        refineResults,
        refineType,
        usedTotalItemCosts,
      });

      allRefineResults.set(refineParamsId, refineParamsResult);

      const previousUsedRefineResult = usedRefineResultsMap.get(currentRefineLevel - 1);
      const previousUsedRefineConsumedMaterials = previousUsedRefineResult?.totalConsumedMaterials
        ?? createConsumedMaterials({ items: { amount: 1, refineLevel: 0 } });
      const consumedItems = refineParamsResult.totalConsumedMaterials.items;

      let totalConsumedMaterials: ConsumedMaterials | undefined = undefined;
      let refineConsumedMaterials: ConsumedMaterials | undefined = undefined;
      let totalCost: number;
      let totalItemCost: number;

      if (consumedItems) {
        const usedRefineResultForConsumedItem = usedRefineResultsMap.get(consumedItems.refineLevel - 1);

        refineConsumedMaterials = {
          items: multiplyItems(
            usedRefineResultForConsumedItem.totalConsumedMaterials.items,
            consumedItems.amount,
          ),
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            multiplyConsumedMaterialsBase(
              usedRefineResultForConsumedItem.totalConsumedMaterials,
              consumedItems.amount,
            ),
          ),
        };

        totalConsumedMaterials = {
          items: consumedItems.refineLevel !== currentRefineLevel
            ? addItems(
              previousUsedRefineConsumedMaterials.items,
              multiplyItems(usedRefineResultForConsumedItem.totalConsumedMaterials.items, consumedItems.amount),
            )
            : multiplyItems(usedRefineResultForConsumedItem.totalConsumedMaterials.items, consumedItems.amount + 1),
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            previousUsedRefineConsumedMaterials,
            multiplyConsumedMaterialsBase(
              usedRefineResultForConsumedItem.totalConsumedMaterials,
              consumedItems.amount,
            ),
          ),
        };

        totalCost = (previousUsedRefineResult?.totalCost ?? 0) + refineParamsResult.totalCost;
        totalItemCost = (previousUsedRefineResult?.totalItemCost ?? baseItemCost) + refineParamsResult.totalCost;
      }
      else {
        refineConsumedMaterials = {
          ...refineParamsResult.totalConsumedMaterials,
        };
        totalConsumedMaterials = {
          items: previousUsedRefineConsumedMaterials.items,
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            previousUsedRefineConsumedMaterials,
          ),
        };

        totalItemCost = (previousUsedRefineResult?.totalItemCost ?? baseItemCost) + refineParamsResult.totalCost;
        totalCost = (previousUsedRefineResult?.totalCost ?? 0) + refineParamsResult.totalCost;
      }

      allRefineParamsResults.set(refineParamsId, {
        id: refineParamsId,
        refineConsumedMaterials,
        refineCost: refineParamsResult.totalCost,
        refineParams,
        totalConsumedMaterials,
        totalCost,
        totalItemCost,
      });

      if (!bestRefineParamsId || totalItemCost < bestRefineItemTotalCost) {
        bestRefineParamsId = getRefineParamsId(refineParams);
        bestRefineItemTotalCost = totalItemCost;
      }
    }

    const preferredRefineParamsId = refineParamsPreferences.get(currentRefineLevel + 1);
    const usedRefineParamsId = preferredRefineParamsId !== undefined
      ? preferredRefineParamsId
      : bestRefineParamsId;

    const usedRefineResult = allRefineParamsResults.get(usedRefineParamsId);
    usedRefineResultsMap.set(currentRefineLevel, usedRefineResult);

    currentRefineLevel++;

    refineResults.set(currentRefineLevel, allRefineResults.get(usedRefineResult.id));
    totalRefineResults.set(currentRefineLevel, {
      usedRefineParamsId: usedRefineResult.id,
      bestRefineParamsId,
      refineParamsResults: allRefineParamsResults,
      refineLevel: currentRefineLevel,
    });
  }

  return [...totalRefineResults.values()];
}, { length: false });

type Params = {
  readonly baseItemCost: number;
  readonly itemCosts: Map<number, number>;
  readonly refineParamsPreferences?: Map<number, string>;
  readonly refineType: RefineType;
  readonly startingRefineLevel?: number;
  readonly targetRefineLevel: number;
  readonly totalRefineResults?: Map<number, TotalRefineResult>;
  readonly usedRefineResultsMap?: Map<number, RefineParamsResult>;
};

export const calculateTotalRefineCost = ({
  baseItemCost,
  itemCosts,
  refineParamsPreferences,
  refineType,
  startingRefineLevel,
  targetRefineLevel,
  totalRefineResults,
  usedRefineResultsMap,
}: Params): readonly TotalRefineResult[] => {
  return calculateTotalRefineCostMemoized(
    baseItemCost,
    itemCosts,
    refineParamsPreferences,
    refineType,
    startingRefineLevel,
    targetRefineLevel,
    totalRefineResults,
    usedRefineResultsMap,
  );
};

export const clearCalculationResults = (): void => {
  calculateTotalRefineCostMemoized.clear();
};