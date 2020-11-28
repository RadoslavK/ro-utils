import { RefineInput } from '../types/refineInput.type';
import { calculateRefineBox, RefineBoxResult } from './calculateRefineBox';

type Params = {
  readonly itemCosts: ReadonlyMap<number, number>;
  readonly refineInput: RefineInput;
};

type Result = {
  readonly results: ReadonlyMap<number, RefineBoxResult>;
};

export const calculateAllRefineBoxes = (params: Params): Result => {
  const { itemCosts, refineInput } = params;
  const allResults = new Map<number, RefineBoxResult>();

  let targetRefineBoxLevel = 5;

  while (targetRefineBoxLevel <= refineInput.targetRefineLevel) {
    const refineBoxResults = calculateRefineBox({
      itemCosts,
      refineInput,
      targetRefineBoxLevel,
    });

    allResults.set(targetRefineBoxLevel, refineBoxResults);

    targetRefineBoxLevel++;
  }

  return {
    results: allResults,
  };
};