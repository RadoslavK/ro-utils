import { RefineMaterial } from '../types/refineMaterial.type';
import { RefineParameters } from '../types/RefineParameters.type';

export const generateRefineParams = (targetLevel: number): readonly RefineParameters[] => {
  const refineParams: RefineParameters[] = [];

  for (const oreType of Object.values(RefineMaterial)) {
    if (targetLevel > 7 || oreType !== RefineMaterial.HD) {
      refineParams.push({
        oreType,
        useBsb: false,
      });
    }

    if (targetLevel > 7) {
      refineParams.push({
        oreType,
        useBsb: true,
      });
    }
  }

  return refineParams;
};