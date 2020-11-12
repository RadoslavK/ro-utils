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
};

export const calculateTotalRefineCost = ({
  itemCosts,
  refineInput,
  refineParamsPreferences,
}: Params): readonly TotalRefineResult[] => {
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
        usedTotalCosts: [...totalRefineResults.entries()]
          .reduce((reduced, [key, result]) => {
            reduced.set(key, result.refineParamsResults.get(result.usedRefineParamsId).totalItemCost);

            return reduced;
          }, new Map<number, number>()),
      });

      allRefineResults.set(refineParamsId, refineParamsResult);

      const previousUsedRefineResult = usedRefineResultsMap.get(currentRefineLevel - 1);
      const previousUsedRefineConsumedMaterials = previousUsedRefineResult?.totalConsumedMaterials
        ?? createConsumedMaterials({ items: { amount: 1, refineLevel: currentRefineLevel < startingRefineLevel ? 0 : startingRefineLevel } });
      const previousUsedRefineItemConsumedMaterials = previousUsedRefineResult?.totalItemConsumedMaterials
        ?? createConsumedMaterials({ items: { amount: 1, refineLevel: currentRefineLevel < startingRefineLevel ? 0 : startingRefineLevel } });
      const consumedItems = refineParamsResult.totalConsumedMaterials.items;

      let totalConsumedMaterials: ConsumedMaterials;
      let totalItemConsumedMaterials: ConsumedMaterials;
      let refineConsumedMaterials: ConsumedMaterials;
      let totalCost: number;
      let totalItemCost: number;

      if (consumedItems) {
        const usedRefineResultForConsumedItem = usedRefineResultsMap.get(consumedItems.refineLevel - 1);

        if (startingRefineLevel > 0 && currentRefineLevel === startingRefineLevel) {
          refineConsumedMaterials = {
            ...refineParamsResult.totalConsumedMaterials,
          };
        }
        else {
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
        }

        totalItemCost = (previousUsedRefineResult?.totalItemCost ?? baseItemCost) + refineParamsResult.totalCost;
        totalItemConsumedMaterials = {
          items: consumedItems.refineLevel !== currentRefineLevel
            ? addItems(
              previousUsedRefineItemConsumedMaterials.items,
              multiplyItems(usedRefineResultForConsumedItem.totalItemConsumedMaterials.items, consumedItems.amount),
            )
            : multiplyItems(usedRefineResultForConsumedItem.totalItemConsumedMaterials.items, consumedItems.amount + 1),
          ...addConsumedMaterialsBase(
            refineParamsResult.totalConsumedMaterials,
            previousUsedRefineItemConsumedMaterials,
            multiplyConsumedMaterialsBase(
              usedRefineResultForConsumedItem.totalItemConsumedMaterials,
              consumedItems.amount,
            ),
          ),
        };

        if (startingRefineLevel > 0 && currentRefineLevel === startingRefineLevel) {
          totalConsumedMaterials = {
            ...refineParamsResult.totalConsumedMaterials,
            items: consumedItems.refineLevel !== currentRefineLevel
              ? consumedItems
              : { refineLevel: startingRefineLevel < currentRefineLevel ? currentRefineLevel : startingRefineLevel, amount: consumedItems.amount + 1 },
          };

          totalCost = refineParamsResult.totalCost;
        }
        else {
          totalConsumedMaterials = {
            items: consumedItems.refineLevel !== currentRefineLevel
              ? addItems(
                previousUsedRefineConsumedMaterials.items,
                multiplyItems(consumedItems, usedRefineResultForConsumedItem.totalConsumedMaterials.items.amount),
              )
              : multiplyItems( {... consumedItems, amount: consumedItems.amount + 1 }, usedRefineResultForConsumedItem.totalConsumedMaterials.items.amount),
            ...addConsumedMaterialsBase(
              refineParamsResult.totalConsumedMaterials,
              previousUsedRefineConsumedMaterials,
              multiplyConsumedMaterialsBase(
                usedRefineResultForConsumedItem.totalConsumedMaterials,
                consumedItems.amount,
              ),
            ),
          };

          totalCost = (previousUsedRefineResult?.totalCost ?? baseItemCost) + refineParamsResult.totalCost;
        }
      }
      else {
        if (isOreRefineParameters(refineParams)) {
          refineConsumedMaterials = {
            ...refineParamsResult.totalConsumedMaterials,
          };

          totalItemCost = (previousUsedRefineResult?.totalItemCost ?? baseItemCost) + refineParamsResult.totalCost;
          totalItemConsumedMaterials = {
            items: previousUsedRefineItemConsumedMaterials.items,
            ...addConsumedMaterialsBase(
              refineParamsResult.totalConsumedMaterials,
              previousUsedRefineItemConsumedMaterials,
            ),
          }

          if (startingRefineLevel > 0 && currentRefineLevel === startingRefineLevel) {
            totalConsumedMaterials = {
              ...refineParamsResult.totalConsumedMaterials,
              items: {
                refineLevel: startingRefineLevel,
                amount: previousUsedRefineConsumedMaterials.items.amount,
              },
            };

            totalCost = refineParamsResult.totalCost;
          }
          else {
            totalConsumedMaterials = {
              items: previousUsedRefineConsumedMaterials.items,
              ...addConsumedMaterialsBase(
                refineParamsResult.totalConsumedMaterials,
                previousUsedRefineConsumedMaterials,
              ),
            };

            totalCost = (previousUsedRefineResult?.totalCost ?? baseItemCost) + refineParamsResult.totalCost;
          }
        }
        else {
          refineConsumedMaterials = {
            ...refineParamsResult.totalConsumedMaterials,
          };
          totalItemConsumedMaterials = {
            ...refineConsumedMaterials,
            items: { amount: 1, refineLevel: startingRefineLevel > currentRefineLevel ? 0 : startingRefineLevel },
          };
          totalConsumedMaterials = {
            ...totalItemConsumedMaterials,
          };

          //  We need to apply the cost of item at current refine
          //  Otherwise it could get misleading results for using refine box for it
          // Min +4 needed to be used
          const startingRefineLevelResult = totalRefineResults.get(startingRefineLevel > currentRefineLevel ? 4 : Math.max(startingRefineLevel, 4));
          const startingRefineLevelTotalItemCost = startingRefineLevelResult?.refineParamsResults
              ?.get(startingRefineLevelResult?.usedRefineParamsId)?.totalItemCost
                ?? baseItemCost;

          totalItemCost = startingRefineLevelTotalItemCost + refineParamsResult.totalCost;
          totalCost = totalItemCost - baseItemCost;
        }
      }

      allRefineParamsResults.set(refineParamsId, {
        totalConsumedMaterials,
        totalItemCost,
        totalCost,
        refineConsumedMaterials,
        totalItemConsumedMaterials,
        refineCost: refineParamsResult.totalCost,
        id: refineParamsId,
        refineParams,
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