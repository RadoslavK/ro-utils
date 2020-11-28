import { calculateRefineBox, RefineBoxCalculationResult } from './calculateRefineBox';
import { RefineType } from '../../common/types/refineType.type';

type Params = {
  readonly baseItemCost: number;
  readonly itemCosts: Map<number, number>;
  readonly refineType: RefineType;
  readonly targetRefineLevel: number;
  readonly maxRefineBoxLevel: number;
};

export const calculateAllRefineBoxes = (params: Params): Map<number, RefineBoxCalculationResult> => {
  const allResults: Map<number, RefineBoxCalculationResult> = new Map<number, RefineBoxCalculationResult>();

  let targetRefineBoxLevel = 5;

  while (targetRefineBoxLevel <= Math.min(params.targetRefineLevel, params.maxRefineBoxLevel)) {
    const refineBoxResults = calculateRefineBox({
      ...params,
      refineBoxInput: {
        targetLevel: targetRefineBoxLevel,
      },
    });

    allResults.set(targetRefineBoxLevel, refineBoxResults);

    targetRefineBoxLevel++;
  }

  return allResults;
};