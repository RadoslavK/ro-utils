import { ConsumedMaterials } from './consumedMaterials.type';
import { RefineParameters } from './RefineParameters.type';

export type RefineParamsResult = {
  readonly id: string;
  readonly consumedMaterials: ConsumedMaterials;
  readonly cost: number;
  readonly refineParams: RefineParameters;
}

export type TotalRefineResult = {
  readonly refineLevel: number;
  readonly refineParamsResults: Map<string, RefineParamsResult>;
  readonly bestRefineParamsId: string;
  readonly usedRefineParamsId: string;
};