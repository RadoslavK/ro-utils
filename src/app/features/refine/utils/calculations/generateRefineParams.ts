import { RefineParameters, useRefineBoxParameters } from '../../types/RefineParameters.type';
import { OreType } from '../../types/oreType.type';

export const generateRefineParams = (targetLevel: number): readonly RefineParameters[] => {
  const refineParams: RefineParameters[] = [];

  if (targetLevel >= 5 && targetLevel <= 10) {
    refineParams.push(useRefineBoxParameters);
  }

  for (const oreType of Object.values(OreType)) {
    if (targetLevel > 7 || oreType !== OreType.HD) {
      refineParams.push({
        oreType,
        useBsb: false,
      });
    }

    if (targetLevel > 7 && oreType !== OreType.HD) {
      refineParams.push({
        oreType,
        useBsb: true,
      });
    }
  }

  return refineParams;
};