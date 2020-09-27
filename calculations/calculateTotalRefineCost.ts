import { RefineType } from '../types/refineType.type';
import { RefineResult } from '../types/refineResult.type';
import { RefineParamsResult, TotalRefineResult } from '../types/totalRefineResult';
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

export type TotalRefineCostResult = {
  readonly refineResults: readonly RefineResult[];
  readonly totalRefineResults: readonly TotalRefineResult[];
}

const getRefineParamsId = (refineParams: RefineParameters): string =>
  `${refineParams.oreType}|${refineParams.useBsb}`;

export const calculateTotalRefineCost = ({
  baseCost,
  startingRefineLevel = 0,
  targetRefineLevel = 10,
  refineType = RefineType.Armor,
}: Params): TotalRefineCostResult => {
  const refineResults: Map<number, RefineResult> = new Map<number, RefineResult>([
    [startingRefineLevel, {
      cost: 0,
      consumedMaterials: {},
      refineAttempts: 0,
      refineLevel: startingRefineLevel,
    }],
  ]);

  const totalRefineResults: Map<number, TotalRefineResult> = new Map<number, TotalRefineResult>([
    [0, { usedRefineParamsId: '', refineParamsResults: new Map<string, RefineParamsResult>(), bestRefineParamsId: '', refineLevel: 0 }],
  ])

  let totalCost = baseCost;
  let totalConsumedMaterials: ConsumedMaterials = {};
  let currentRefineLevel = startingRefineLevel;

  do {
    const refineParamsToTry = generateRefineParams(currentRefineLevel + 1);

    const allRefineParamsResults: Map<string, RefineParamsResult> = new Map<string, RefineParamsResult>();
    const allRefineResults: Map<string, RefineResult> = new Map<string, RefineResult>();

    let bestRefineResult: RefineResult;
    let bestRefineParamsId: string;

    for (const refineParams of refineParamsToTry) {
      const refineParamsResult = calculateRefineCostForLevel({
        currentRefineLevel,
        oreType: refineParams.oreType,
        refineResults,
        refineType,
        useBsb: refineParams.useBsb,
        totalRefineResults,
      });

      const refineParamsId = getRefineParamsId(refineParams);

      allRefineResults.set(refineParamsId, refineParamsResult);

      allRefineParamsResults.set(refineParamsId, {
        id: refineParamsId,
        consumedMaterials: {
          baseItemCount: (totalConsumedMaterials.baseItemCount || 1) * (refineParamsResult.consumedMaterials.baseItemCount || 1),
          normalOre: (totalConsumedMaterials.normalOre || 0) + (refineParamsResult.consumedMaterials.normalOre || 0),
          enrichedOre: (totalConsumedMaterials.enrichedOre || 0) + (refineParamsResult.consumedMaterials.enrichedOre || 0),
          hdOre: (totalConsumedMaterials.hdOre || 0) + (refineParamsResult.consumedMaterials.hdOre || 0),
          bsb: (totalConsumedMaterials.bsb || 0) + (refineParamsResult.consumedMaterials.bsb || 0),
        },
        cost: totalCost + refineParamsResult.cost,
        refineParams,
      })

      if (!bestRefineParamsId || refineParamsResult.cost < bestRefineResult.cost) {
        bestRefineParamsId = getRefineParamsId(refineParams);
        bestRefineResult = refineParamsResult;
      }
    }

    const usedRefineResult = allRefineParamsResults.get(bestRefineParamsId);

    totalCost = usedRefineResult.cost;
    totalConsumedMaterials = usedRefineResult.consumedMaterials;

    currentRefineLevel++;

    refineResults.set(currentRefineLevel, allRefineResults.get(usedRefineResult.id));
    totalRefineResults.set(currentRefineLevel, {
      usedRefineParamsId: usedRefineResult.id,
      bestRefineParamsId,
      refineParamsResults: allRefineParamsResults,
      refineLevel: currentRefineLevel,
    });
  } while (currentRefineLevel < targetRefineLevel);

  return {
    refineResults: [...refineResults.values()],
    totalRefineResults: [...totalRefineResults.values()],
  };
};