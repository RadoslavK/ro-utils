import { RefineInput } from '../../common/types/refineInput.type';
import { calculateUpgradeCostForLevel, UpgradeCostLevelResult } from './calculateUpgradeCostForLevel';
import { generateOreRefineParams } from './generateOreRefineParams';
import { getRefineParamsId } from '../../v1/utils/getRefineParamsId';

type Params = {
  readonly itemCosts: ReadonlyMap<number, number>;
  readonly refineInput: RefineInput;
  readonly refineParamsPreferences: ReadonlyMap<number, string>;
};

export type RefineLevelResult = {
  readonly bestRefineParamsId: string;
  readonly refineParamsResults: ReadonlyMap<string, UpgradeCostLevelResult>;
  readonly usedRefineParamsId: string;
};

type Result = {
  readonly results: ReadonlyMap<number, RefineLevelResult>;
};

export const calculateUpgradeCost = (params: Params): Result => {
  const { itemCosts, refineInput, refineParamsPreferences } = params;
  const { baseItemCost, targetRefineLevel } = refineInput;

  const refineCosts = new Map<number, number>([[0, 0]]);
  const refineTotalCosts = new Map<number, number>([[0, baseItemCost]]);
  const results = new Map<number, RefineLevelResult>();

  let currentRefineLevel = 0;

  while (currentRefineLevel < targetRefineLevel) {
    const targetLevel = currentRefineLevel + 1;
    const allRefineParams = generateOreRefineParams(targetLevel);
    const refineParamsResults = new Map<string, UpgradeCostLevelResult>();

    for (const refineParams of allRefineParams) {
      const paramsId = getRefineParamsId(refineParams);
      const paramsResult = calculateUpgradeCostForLevel({
        itemCosts,
        level: targetLevel,
        refineCosts,
        refineInput,
        refineParams,
        refineTotalCosts,
      });

      refineParamsResults.set(paramsId, paramsResult);
    }

    const preferredParamsId = refineParamsPreferences.get(targetLevel);
    const bestRefineParamsId = getBestRefineParamsId(refineParamsResults);
    const usedRefineParamsId = preferredParamsId || bestRefineParamsId;
    const usedRefineParamsResult = refineParamsResults.get(usedRefineParamsId);

    refineCosts.set(targetLevel, usedRefineParamsResult.average.cost);
    refineTotalCosts.set(targetLevel, usedRefineParamsResult.average.totalCost);

    const levelResult: RefineLevelResult = {
      bestRefineParamsId,
      refineParamsResults,
      usedRefineParamsId,
    };

    results.set(targetLevel, levelResult);

    currentRefineLevel++;
  }

  return {
    results,
  };
};

const getBestRefineParamsId = (paramsResults: ReadonlyMap<string, UpgradeCostLevelResult>): string => {
  if (!paramsResults.size) {
    throw new Error('No refine params results provided');
  }

  let bestId: string;
  let bestCost: number | undefined = undefined;

  for (const [id, result] of paramsResults) {
    if (bestCost === undefined || result.average.cost < bestCost) {
      bestCost = result.average.cost;
      bestId = id;
    }
  }

  return bestId;
};