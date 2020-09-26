import { ConsumedMaterials } from './consumedMaterials.type';
import { RefineParameters } from './RefineParameters.type';

export type TotalRefineResult = {
  readonly consumedMaterials: ConsumedMaterials;
  readonly cost: number;
  readonly refineParams: RefineParameters;
  readonly refineLevel: number;
};