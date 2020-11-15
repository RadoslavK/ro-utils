import { OreRefineParameters } from '../types/RefineParameters.type';
import { OreType } from '../types/oreType.type';

export const generateOreRefineParams = (targetLevel: number, startingRefineLevel: number): readonly OreRefineParameters[] => {
  const refineParams: OreRefineParameters[] = [];

  for (const oreType of Object.values(OreType)) {
    if (oreType === OreType.HD && (targetLevel - startingRefineLevel < 2)) {
      continue;
    }

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