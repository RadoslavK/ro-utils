import { OreRefineParameters, RefineBoxParameters } from '../types/refineParameters.type';

export const getOreRefineParamsId = ({ oreType, useBsb }: OreRefineParameters): string =>
    `oreType: ${oreType}, useBsb: ${useBsb}`;

export const getRefineBoxParamsId = (refineParams: RefineBoxParameters): string =>
  `useRefineBox: ${refineParams}`;