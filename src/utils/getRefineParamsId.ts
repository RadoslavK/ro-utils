import { isOreRefineParameters, RefineParameters } from '../types/RefineParameters.type';

export const getRefineParamsId = (refineParams: RefineParameters): string =>
  isOreRefineParameters(refineParams)
    ? `oreType: ${refineParams.oreType}, useBsb: ${refineParams.useBsb}`
    : `useRefineBox: ${refineParams}`;