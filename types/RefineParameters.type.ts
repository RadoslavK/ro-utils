import { OreType } from './oreType.type';

export type OreRefineParameters = {
  readonly oreType: OreType;
  readonly useBsb: boolean;
};

export type RefineBoxParameters = true;

export const useRefineBoxParameters: RefineBoxParameters = true;

export type RefineParameters = OreRefineParameters | RefineBoxParameters;

export const isOreRefineParameters = (parameters: RefineParameters): parameters is OreRefineParameters =>
  (parameters as OreRefineParameters).oreType !== undefined;