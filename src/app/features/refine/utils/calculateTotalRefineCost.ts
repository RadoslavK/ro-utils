import {
  addConsumedMaterialsBase, addItems, ConsumedMaterials, createConsumedMaterials,
  multiplyConsumedMaterialsBase, multiplyItems,
} from '../types/consumedMaterials.type';
import { generateRefineParams } from './generateRefineParams';
import { calculateRefineCostForLevel } from './calculateRefineCostForLevel';
import {
  RefineParamsResult,
  TotalRefineResult,
} from '../types/totalRefineResult.type';
import { getRefineParamsId } from './getRefineParamsId';
import { RefineResult } from '../types/refineResult.type';
import { isOreRefineParameters } from '../types/RefineParameters.type';
import { RefineInput } from '../types/refineInput.type';

type Params = {
  readonly itemCosts: Map<number, number>;
  readonly refineInput: RefineInput;
  readonly refineParamsPreferences: Map<number, string>;
  readonly startingRefineLevel?: number;
};

export const calculateTotalRefineCost = ({
  itemCosts,
  refineInput,
  refineParamsPreferences,
  startingRefineLevel = 0,
}: Params): readonly TotalRefineResult[] => {
  const {
    baseItemCost,
    refineType,
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

    let bestRefineItemTotalCost: number;
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
        startingRefineLevel,
        usedTotalCosts: [...totalRefineResults.entries()]
          .reduce((reduced, [key, result]) => {
            reduced.set(key, result.refineParamsResults.get(result.usedRefineParamsId).totalCost);

            return reduced;
          }, new Map<number, number>()),
        usedTotalItemCosts: [...totalRefineResults.entries()]
          .reduce((reduced, [key, result]) => {
            reduced.set(key, result.refineParamsResults.get(result.usedRefineParamsId).totalItemCost);

            return reduced;
          }, new Map<number, number>()),
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

        if (startingRefineLevel === 0) {
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
        }

        if (startingRefineLevel > 0 && currentRefineLevel === startingRefineLevel) {
          totalCost = refineParamsResult.totalCost;
        }
        else {
          totalCost = (previousUsedRefineResult?.totalCost ?? 0) + refineParamsResult.totalCost;
        }

        totalItemCost = (previousUsedRefineResult?.totalItemCost ?? baseItemCost) + refineParamsResult.totalCost;
      }
      else {
        if (isOreRefineParameters(refineParams)) {
          if (startingRefineLevel === 0) {
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
          }

          totalItemCost = (previousUsedRefineResult?.totalItemCost ?? baseItemCost) + refineParamsResult.totalCost;

          if (startingRefineLevel > 0 && currentRefineLevel === startingRefineLevel) {
            totalCost = refineParamsResult.totalCost;
          }
          else {
            totalCost = (previousUsedRefineResult?.totalCost ?? 0) + refineParamsResult.totalCost;
          }
        }
        else {
          if (startingRefineLevel === 0) {
            refineConsumedMaterials = {
              ...refineParamsResult.totalConsumedMaterials,
            };
            totalConsumedMaterials = {
              ...refineConsumedMaterials,
              items: { amount: 1, refineLevel: startingRefineLevel > currentRefineLevel ? 0 : startingRefineLevel },
            };
          }

          //  We need to apply the cost of item at starting refine
          //  Otherwise it could get misleading results for using refine box for it
          const startingRefineLevelResult = totalRefineResults.get(startingRefineLevel);
          const startingRefineLevelTotalItemCost = startingRefineLevelResult?.refineParamsResults
              ?.get(startingRefineLevelResult?.usedRefineParamsId)?.totalItemCost
                ?? baseItemCost;

          totalItemCost = startingRefineLevelTotalItemCost + refineParamsResult.totalCost;
          totalCost = totalItemCost - baseItemCost;
        }
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
  } while (currentRefineLevel < targetRefineLevel);

  return [...totalRefineResults.values()];
};