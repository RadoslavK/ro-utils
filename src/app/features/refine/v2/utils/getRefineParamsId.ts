import { OreRefineParameters } from '../../v1/types/RefineParameters.type';

export const getOreRefineParamsId = ({ oreType, useBsb }: OreRefineParameters): string =>
    `oreType: ${oreType}, useBsb: ${useBsb}`;