import { UpgradeCostLevelResult } from './calculateUpgradeCostForLevel';
import { RefineLevelResult } from './calculateUpgradeCost';

export const getLastUpgradeLevelUsedResult = (results: ReadonlyMap<number, RefineLevelResult>): UpgradeCostLevelResult => {
  const lastLevelResults = [...results.values()].slice(-1)[0];

  return lastLevelResults.refineParamsResults.get(lastLevelResults.usedRefineParamsId);
};