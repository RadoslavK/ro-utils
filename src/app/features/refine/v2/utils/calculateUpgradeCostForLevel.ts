import { OreRefineParameters } from '../../v1/types/RefineParameters.type';
import { getRefineChance } from '../../common/constants/refineChances';
import { RefineInput } from '../../common/types/refineInput.type';
import { RefineType } from '../../common/types/refineType.type';
import { getOreCost } from '../../common/utils/getOreCost';
import { getOreId } from '../../common/utils/getOreId';
import { getRefineCost } from '../../common/utils/getRefineCost';
import { refineItemIds } from '../../common/constants/refineItemIds';
import { OreType } from '../../common/types/oreType.type';
import { bsbAmountsNeeded } from '../../common/constants/bsbAmountsNeeded';

type Params = {
  readonly itemCosts: ReadonlyMap<number, number>;
  readonly level: number;
  readonly refineCosts: ReadonlyMap<number, number>;
  readonly refineInput: RefineInput;
  readonly refineParams: OreRefineParameters;
  readonly refineTotalCosts: ReadonlyMap<number, number>;
};

type UpgradeResult = {
  readonly attempts: number;
  readonly cost: number;
  readonly totalCost: number;
};

export type UpgradeCostLevelResult = {
  readonly average: UpgradeResult;
  readonly max: UpgradeResult;
  readonly min: UpgradeResult;
  readonly refineParams: OreRefineParameters;
};

export const calculateUpgradeCostForLevel = (params: Params): UpgradeCostLevelResult => {
  const {
    itemCosts,
    level,
    refineCosts,
    refineInput: { refineType },
    refineParams,
    refineTotalCosts,
  } = params;
  const { oreType } = refineParams;

  const chance = getRefineChance(refineType, oreType, level);

  const p = chance / 100;
  const attemptsAverage = 1 / p;
  const standardDeviation = Math.sqrt((1 - p) / (p ** 2));
  const attemptsMax = attemptsAverage + standardDeviation;

  const previousLevel = level - 1;
  const previousLevelTotalCost = refineTotalCosts.get(previousLevel);

  const zenyCostPerAttempt = getRefineCost(refineType, oreType);
  const successCost = getSuccessCost({
    refineType,
    refineParams,
    itemCosts,
    targetLevel: level,
  });
  const failureCostAverage = getFailureCost({
    itemCosts,
    previousLevelCost: previousLevelTotalCost,
    refineAttempts: attemptsAverage,
    refineCosts,
    refineParams,
    refineType,
    targetLevel: level,
  });
  const failureCostMax = getFailureCost({
    itemCosts,
    previousLevelCost: previousLevelTotalCost,
    refineAttempts: attemptsMax,
    refineCosts,
    refineParams,
    refineType,
    targetLevel: level,
  });

  const costAverage = zenyCostPerAttempt * attemptsAverage + failureCostAverage + successCost;
  const costMax = zenyCostPerAttempt * attemptsMax + failureCostMax + successCost;
  const costMin = zenyCostPerAttempt + successCost;

  return {
    average: { cost: costAverage, attempts: attemptsAverage, totalCost: previousLevelTotalCost + costAverage },
    max: { cost: costMax, attempts: attemptsMax, totalCost: previousLevelTotalCost + costMax },
    min: { cost: costMin, attempts: 1, totalCost: previousLevelTotalCost + costMin },
    refineParams,
  };
};

type SuccessCostParams = {
  readonly itemCosts: ReadonlyMap<number, number>;
  readonly refineParams: OreRefineParameters;
  readonly refineType: RefineType;
  readonly targetLevel: number;
};

const getSuccessCost = (params: SuccessCostParams): number => {
  const { itemCosts, refineParams, refineType, targetLevel } = params;
  const { oreType, useBsb } = refineParams;
  const oreId = getOreId(oreType, refineType);
  const oreCost = getOreCost(oreId, itemCosts);
  const bsbAmount = useBsb ? bsbAmountsNeeded.get(targetLevel): 0
  const bsbCost = bsbAmount * itemCosts.get(refineItemIds.BlacksmithBlessing);
  const totalBsbCost = useBsb ? bsbCost : 0;

  return oreCost + totalBsbCost;
};

type FailureCostParams = {
  readonly itemCosts: ReadonlyMap<number, number>;
  readonly previousLevelCost: number;
  readonly refineAttempts: number;
  readonly refineCosts: ReadonlyMap<number, number>;
  readonly refineParams: OreRefineParameters;
  readonly refineType: RefineType;
  readonly targetLevel: number;
};

const getFailureCost = (params: FailureCostParams): number => {
  const {
    itemCosts,
    previousLevelCost,
    refineAttempts,
    refineCosts,
    refineParams,
    refineType,
    targetLevel,
  } = params;
  const { oreType, useBsb } = refineParams;
  const failedRefineAttempts = Math.max(0, refineAttempts - 1);

  if (failedRefineAttempts === 0) {
    return 0;
  }

  const oreId = getOreId(oreType, refineType);
  const oreCost = getOreCost(oreId, itemCosts);

  if (oreType === OreType.HD) {
    const downgradedTargetLevel = targetLevel - 1;
    const downgradedItemUpgradeCost = refineCosts.get(downgradedTargetLevel);
    const failedAttemptCost = oreCost + downgradedItemUpgradeCost;

    return failedAttemptCost * failedRefineAttempts;
  }

  const brokenItemCost = useBsb ? 0 : previousLevelCost;
  const bsbAmount = useBsb ? bsbAmountsNeeded.get(targetLevel): 0
  const bsbCost = itemCosts.get(refineItemIds.BlacksmithBlessing);
  const totalBsbCost = bsbAmount * bsbCost;
  const failedAttemptCost = oreCost + brokenItemCost + totalBsbCost;

  return failedAttemptCost * failedRefineAttempts;
};
