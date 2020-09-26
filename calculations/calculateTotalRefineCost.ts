import { RefineType } from '../types/refineType.type';
import { RefineResult } from '../types/refineResult.type';
import { TotalRefineResult } from '../types/totalRefineResult';
import { ConsumedMaterials } from '../types/consumedMaterials.type';
import { generateRefineParams } from '../utils/generateRefineParams';
import { RefineParameters } from '../types/RefineParameters.type';
import { calculateRefineCostForLevel } from './calcualteRefineCostForLevel';

type Params = {
  readonly baseCost: number;
  readonly startingRefineLevel?: number,
  readonly targetRefineLevel?: number,
  readonly refineType?: RefineType,
};

type Result = {
  readonly refineResults: Map<number, RefineResult>;
  readonly totalRefineResults: Map<number, TotalRefineResult>;
}

export const calculateTotalRefineCost = ({
  baseCost,
  startingRefineLevel = 0,
  targetRefineLevel = 10,
  refineType = RefineType.Armor,
}: Params): Result => {
  const refineResults: Map<number, RefineResult> = new Map<number, RefineResult>([
    [startingRefineLevel, {
      cost: 0,
      consumedMaterials: {},
      refineAttempts: 0,
      refineLevel: startingRefineLevel,
    }],
  ]);

  const totalRefineResults: Map<number, TotalRefineResult> = new Map<number, TotalRefineResult>()

  let totalCost = baseCost;
  let totalConsumedMaterials: ConsumedMaterials = {};
  let currentRefineLevel = startingRefineLevel;

  do {
    const refineParamsToTry = generateRefineParams(currentRefineLevel + 1);

    let winnerRefineParams: RefineParameters;
    let winnerRefineResult: RefineResult;

    for (const refineParams of refineParamsToTry) {
      const refineResult = calculateRefineCostForLevel({
        currentRefineLevel,
        oreType: refineParams.oreType,
        refineResults,
        refineType,
        useBsb: refineParams.useBsb,
        totalRefineResults,
      });

      if (!winnerRefineResult || !winnerRefineParams || refineResult.cost < winnerRefineResult.cost) {
        winnerRefineParams = refineParams;
        winnerRefineResult = refineResult;
      }
    }

    totalCost += winnerRefineResult.cost;
    totalConsumedMaterials = {
      baseItemCount: (totalConsumedMaterials.baseItemCount || 1) * (winnerRefineResult.consumedMaterials.baseItemCount || 1),
      normalOre: (totalConsumedMaterials.normalOre || 0) + (winnerRefineResult.consumedMaterials.normalOre || 0),
      enrichedOre: (totalConsumedMaterials.enrichedOre || 0) + (winnerRefineResult.consumedMaterials.enrichedOre || 0),
      hdOre: (totalConsumedMaterials.hdOre || 0) + (winnerRefineResult.consumedMaterials.hdOre || 0),
      bsb: (totalConsumedMaterials.bsb || 0) + (winnerRefineResult.consumedMaterials.bsb || 0),
    }

    currentRefineLevel++;

    refineResults.set(currentRefineLevel, winnerRefineResult);
    totalRefineResults.set(currentRefineLevel, {
      cost: totalCost,
      consumedMaterials: totalConsumedMaterials,
      refineLevel: currentRefineLevel,
      refineParams: winnerRefineParams,
    });
  } while (currentRefineLevel < targetRefineLevel);

  return {
    refineResults,
    totalRefineResults,
  };
};