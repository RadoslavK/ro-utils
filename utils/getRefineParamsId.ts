import { RefineParameters } from '../types/RefineParameters.type';

export const getRefineParamsId = (refineParams: RefineParameters): string =>
  `${refineParams.oreType}|${refineParams.useBsb}`;