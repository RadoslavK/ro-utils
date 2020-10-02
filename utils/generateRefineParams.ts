import { RefineParameters } from '../types/RefineParameters.type';
import { OreType } from '../types/oreType.type';

export const generateRefineParams = (targetLevel: number): readonly RefineParameters[] => {
  const refineParams: RefineParameters[] = [];

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