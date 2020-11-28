import { RefineInput } from '../types/refineInput.type';
import { refineBoxChances } from '../constants/refineBoxChances';
import { calculateUpgradeCost, RefineLevelResult } from './calculateUpgradeCost';
import { refineItemIds } from '../constants/refineItemIds';
import { getRefineBoxParamsId } from './getRefineParamsId';
import { UpgradeCostLevelResult, UpgradeResult } from './calculateUpgradeCostForLevel';
import { RefineBoxParameters } from '../types/refineParameters.type';

type Params = {
  readonly itemCosts: ReadonlyMap<number, number>;
  readonly refineInput: RefineInput;
  readonly targetRefineBoxLevel: number;
};

export type RefineBoxLevelResults = {
  readonly minTotalCost: number;
  readonly averageTotalCost;
  readonly chance: number;
  readonly maxTotalCost: number;
  readonly refineResults: ReadonlyMap<number, RefineLevelResult>;
}

export type RefineBoxResult = {
  readonly averageCost: number;
  readonly boxLevelResults: ReadonlyMap<number, RefineBoxLevelResults>;
  readonly maxCost: number;
  readonly minCost: number;
};

type PrepareChancesParams = {
  readonly targetLevel: number;
  readonly targetRefineBoxLevel: number;
};

type LevelResult = {
  readonly chance: number;
  readonly cost: number;
  readonly level: number;
};

export const calculateRefineBox = (params: Params): RefineBoxResult => {
  const { itemCosts, refineInput, targetRefineBoxLevel } = params;
  const { targetRefineLevel } = refineInput;
  const { chances, skippedChances } = prepareChances( {
    targetLevel: targetRefineLevel,
    targetRefineBoxLevel,
  });
  const refineBoxCost = itemCosts.get(refineItemIds.RandomRefineBox);
  const refineCostToPlus4 = calculateUpgradeCost({
    itemCosts,
    refineInput: {
      ...refineInput,
      targetRefineLevel: 4,
    },
    refineParamsPreferences: new Map<number, string>(),
  });
  const plus4Results = [...refineCostToPlus4.results.values()].slice(-1)[0];
  const itemAtPlus4Result = plus4Results.refineParamsResults.get(plus4Results.usedRefineParamsId).average;
  const itemCostAtStartingRefine = itemAtPlus4Result.totalCost + refineBoxCost;

  const allResults: LevelResult[] = [];
  const boxLevelResults = new Map<number, RefineBoxLevelResults>();

  const startingRefineUpgradeResult: UpgradeResult = {
    totalCost: itemCostAtStartingRefine,
    cost: itemAtPlus4Result.cost + refineBoxCost,
    attempts: itemAtPlus4Result.attempts,
  };

  let refineBoxLevel = targetRefineBoxLevel;

  while (refineBoxLevel <= targetRefineLevel) {
    const initialRefineParams: RefineBoxParameters = true;

    const initialRefineParamsId = getRefineBoxParamsId(initialRefineParams);

    const { results } = calculateUpgradeCost({
      itemCosts,
      refineInput,
      refineParamsPreferences: new Map<number, string>(),
      startingRefineParams: {
        costAtStartingLevel: itemCostAtStartingRefine,
        level: refineBoxLevel,
        initialLevelResult: {
          usedRefineParamsId: initialRefineParamsId,
          refineParamsResults: new Map<string, UpgradeCostLevelResult>([
            [initialRefineParamsId, {
              average: startingRefineUpgradeResult,
              max: startingRefineUpgradeResult,
              min: startingRefineUpgradeResult,
              refineParams: initialRefineParams,
            }],
          ]),
          bestRefineParamsId: initialRefineParamsId,
        },
      },
    });

    const lastLevel = [...results.values()].slice(-1)[0];
    const refineResults = lastLevel.refineParamsResults.get(lastLevel.usedRefineParamsId);
    const totalItemCost = refineResults.average.totalCost;
    const chance = chances.get(refineBoxLevel);

    allResults.push({
      chance,
      cost: totalItemCost,
      level: refineBoxLevel,
    });

    const lastResult = [...results.values()].slice(-1)[0];
    const lastResultUsedLevel = lastResult.refineParamsResults.get(lastResult.usedRefineParamsId);

    boxLevelResults.set(refineBoxLevel, {
      maxTotalCost: lastResultUsedLevel.max.totalCost,
      minTotalCost: lastResultUsedLevel.min.totalCost,
      averageTotalCost: lastResultUsedLevel.average.totalCost,
      chance,
      refineResults: results,
    });

    refineBoxLevel++;
  }

  const skippedTotalCost = skippedChances * refineBoxCost;

  const averageCost = calculateAverage({
    allResults,
    skippedTotalCost,
  });

  const skippedVariance = (refineBoxCost ** 2) * (skippedChances / 100);

  const standardDeviation = calculateStandardDeviation({
    allResults,
    averageCost,
    skippedVariance,
  });

  const maxCost = averageCost + standardDeviation * 2;
  const minCost = averageCost - standardDeviation * 2;

  return {
    averageCost,
    maxCost,
    minCost,
    boxLevelResults,
  };
};

type PrepareChancesResult = {
  readonly chances: ReadonlyMap<number, number>;
  readonly skippedChances;
};

const prepareChances = (params: PrepareChancesParams): PrepareChancesResult => {
  const { targetLevel, targetRefineBoxLevel } = params;
  const chancesMap = new Map<number, number>();

  let leftOverChances = 0;
  let skippedChances = 0;

  for (const [level, chance] of refineBoxChances.entries()) {
    if (level < targetRefineBoxLevel) {
      skippedChances += chance;
    }
    else if (level <= targetLevel) {
      chancesMap.set(level, chance);
    }
    else {
      leftOverChances += chance;
    }
  }

  if (leftOverChances > 0) {
    chancesMap.set(targetLevel, chancesMap.get(targetLevel) + leftOverChances);
  }

  return {
    chances: chancesMap,
    skippedChances,
  };
};

type CalculateAverageParams = {
  readonly allResults: readonly LevelResult[];
  readonly skippedTotalCost: number;
};

const calculateAverage = (params: CalculateAverageParams): number => {
  const { allResults, skippedTotalCost } = params;

  let totalCost = skippedTotalCost;
  let totalChance = 0;

  for (const result of allResults) {
    totalChance += result.chance;
    totalCost += result.cost * result.chance;
  }

  return totalCost / totalChance;
};

type CalculateStandardDeviationParams = {
  readonly allResults: readonly LevelResult[];
  readonly averageCost: number;
  readonly skippedVariance: number;
};

const calculateStandardDeviation = (params: CalculateStandardDeviationParams): number => {
  const { allResults, averageCost, skippedVariance } = params;

  const variance = allResults
    .reduce((reduced, result) => {
      const chance = result.chance;
      const p = chance / 100;
      const cost = result.cost;

      return reduced + ((cost - averageCost) ** 2) * p;
    }, skippedVariance);

  return Math.sqrt(variance);
};