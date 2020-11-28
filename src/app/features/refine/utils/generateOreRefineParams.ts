import { OreRefineParameters } from '../types/refineParameters.type';
import { OreType } from '../types/oreType.type';

export const generateOreRefineParams = (level: number): readonly OreRefineParameters[] => {
  const params: OreRefineParameters[] = [];

  for (const oreType of Object.values(OreType)) {
    if (level > 7 || oreType !== OreType.HD) {
      params.push({
        oreType,
        useBsb: false,
      });
    }

    if (level > 7 && oreType !== OreType.HD) {
      params.push({
        oreType,
        useBsb: true,
      });
    }
  }

  return params;
};