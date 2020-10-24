import { RefineParameters } from './RefineParameters.type';
import { TotalConsumedMaterials } from './consumedMaterials.type';

export type RefineParamsResult = {
  readonly id: string;
  readonly refineConsumedMaterials: TotalConsumedMaterials;
  readonly refineCost: number;
  readonly refineParams: RefineParameters;
  readonly totalConsumedMaterials: TotalConsumedMaterials;
  readonly totalCost: number;
  readonly totalItemCost: number;
}

export type TotalRefineResult = {
  readonly refineLevel: number;
  readonly refineParamsResults: Map<string, RefineParamsResult>;
  readonly bestRefineParamsId: string;
  readonly usedRefineParamsId: string;
};