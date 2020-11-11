import { RefineParameters } from './RefineParameters.type';
import { ConsumedMaterials } from './consumedMaterials.type';

export type RefineParamsResult = {
  readonly id: string;
  readonly refineConsumedMaterials: ConsumedMaterials;
  readonly refineCost: number;
  readonly refineParams: RefineParameters;
  readonly totalConsumedMaterials: ConsumedMaterials;
  //  totalCost is different when starting refine is not 0.
  readonly totalCost: number;
  readonly totalItemCost: number;
}

export type TotalRefineResult = {
  readonly refineLevel: number;
  readonly refineParamsResults: Map<string, RefineParamsResult>;
  readonly bestRefineParamsId: string;
  readonly usedRefineParamsId: string;
};