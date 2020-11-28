import { refineBoxChances } from '../../common/constants/refineBoxChances';
import { RefineType } from '../../common/types/refineType.type';
import { calculateTotalRefineCost } from './calculateTotalRefineCost';
import { RefineParamsResult, TotalRefineResult } from '../types/totalRefineResult.type';
import { defaultRefineItemsPrices } from '../../common/constants/defaultRefineItemsPrices';
import { refineItemIds } from '../../common/constants/refineItemIds';
import { createConsumedMaterials } from '../types/consumedMaterials.type';
import { RefineBoxParameters, useRefineBoxParameters } from '../types/RefineParameters.type';
import { getRefineParamsId } from './getRefineParamsId';

export type RefineBoxInput = {
  readonly targetLevel: number;
};

type Params = {
  readonly baseItemCost: number;
  readonly itemCosts: Map<number, number>;
  readonly refineBoxInput: RefineBoxInput;
  readonly refineType: RefineType;
  readonly maxRefineBoxLevel: number;
  readonly targetRefineLevel: number;
};

export type RefineBoxLevelResult = {
  readonly chance: number;
  readonly totalRefineResults: readonly TotalRefineResult[];
}

export type RefineBoxCalculationResult = {
  readonly averageCost: number;
  readonly refineBoxLevelResults: Map<number, RefineBoxLevelResult>;
}

export const calculateRefineBox = ({
  baseItemCost,
  itemCosts,
  maxRefineBoxLevel,
  refineBoxInput,
  refineType,
  targetRefineLevel,
}: Params): RefineBoxCalculationResult => {
  if (refineBoxInput.targetLevel < 5 || refineBoxInput.targetLevel > 10) {
    throw new Error(`Invalid refine box target level: ${refineBoxInput.targetLevel}`);
  }

  if (refineBoxInput.targetLevel > targetRefineLevel) {
    throw new Error(`Box target level (${refineBoxInput.targetLevel}) cannot be higher than target refine level (${targetRefineLevel})`);
  }

  const refineBoxCost = defaultRefineItemsPrices.get(refineItemIds.RandomRefineBox);

  const refineBoxLevelResults = new Map<number,RefineBoxLevelResult>();
  const costs: number[] = [];
  let totalUsedChance = 0;

  for (let level = 5; level <= Math.min(targetRefineLevel, maxRefineBoxLevel); level++) {
    let chance = refineBoxChances[level];

    if (level === targetRefineLevel && level < 10) {
      for (let leftOverLevel = level + 1; leftOverLevel <= 10; leftOverLevel++) {
        chance += refineBoxChances[leftOverLevel];
      }
    }

    if (level < refineBoxInput.targetLevel) {
      costs.push(refineBoxCost * chance);

      continue;
    }

    const refineParams: RefineBoxParameters = useRefineBoxParameters;
    const refineParamsId = getRefineParamsId(refineParams);

    const results = calculateTotalRefineCost({
      baseItemCost,
      itemCosts,
      refineType,
      startingRefineLevel: level,
      targetRefineLevel,
      totalRefineResults: new Map<number, TotalRefineResult>([[level, {
        usedRefineParamsId: refineParamsId,
        refineParamsResults: new Map<string, RefineParamsResult>([[refineParamsId, {
          id: refineParamsId,
          refineConsumedMaterials: createConsumedMaterials({
            refineBox: 1,
          }),
          refineCost: refineBoxCost,
          refineParams,
          totalConsumedMaterials: createConsumedMaterials({
            items: { amount: 1, refineLevel: 0 },
            refineBox: 1,
          }),
          totalCost: refineBoxCost,
          totalItemCost: baseItemCost + refineBoxCost,
        }]]),
        refineLevel: level,
        bestRefineParamsId: refineParamsId,
      }]]),
      usedRefineResultsMap: new Map<number, RefineParamsResult>([[level - 1, {
        refineCost: refineBoxCost,
        refineParams,
        id: refineParamsId,
        refineConsumedMaterials: createConsumedMaterials({
          refineBox: 1,
        }),
        totalConsumedMaterials: createConsumedMaterials({
          items: { amount: 1, refineLevel: 0 },
          refineBox: 1,
        }),
        totalCost: refineBoxCost,
        totalItemCost: baseItemCost + refineBoxCost,
      }]]),
    });

    refineBoxLevelResults.set(level, {
      chance,
      totalRefineResults: results,
    });

    const lastResults = results[results.length - 1];
    const usedLastResult = lastResults.refineParamsResults.get(lastResults.usedRefineParamsId);
    const cost = usedLastResult.totalItemCost;

    chance /= usedLastResult.totalConsumedMaterials.items.amount;

    costs.push(cost * chance);

    totalUsedChance += chance;
  }

  const averageCost = costs
    .reduce(
      (averageCost, cost) => averageCost + cost / totalUsedChance,
      0,
    );

  return {
    averageCost,
    refineBoxLevelResults,
  };
};