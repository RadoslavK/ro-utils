import { calculateUpgradeCost, RefineLevelResult } from './calculateUpgradeCost';
import { calculateAllRefineBoxes } from './calculateAllRefineBoxes';
import { RefineBoxResult } from './calculateRefineBox';
import { RefineInput } from '../types/refineInput.type';

type Params = {
  readonly itemCosts: ReadonlyMap<number, number>;
  readonly noRefineBoxPreferences: ReadonlyMap<number, string>;
  readonly refineInput: RefineInput;
};

export type AllRefineResults = {
  readonly noRefineBoxResults: ReadonlyMap<number, RefineLevelResult>;
  readonly refineBoxesResults: ReadonlyMap<number, RefineBoxResult>;
};

export const calculateAllRefineResults = (params: Params): AllRefineResults => {
  const { itemCosts, refineInput, noRefineBoxPreferences } = params;

  const noRefineBox = calculateUpgradeCost({
    itemCosts,
    refineInput,
    refineParamsPreferences: noRefineBoxPreferences,
  });

  const refineBoxes = calculateAllRefineBoxes({
    itemCosts,
    refineInput,
  });

  return {
    noRefineBoxResults: noRefineBox.results,
    refineBoxesResults: refineBoxes.results,
  };
};