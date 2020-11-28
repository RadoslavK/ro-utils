import { RefineParameters } from './RefineParameters.type';
import { ConsumedMaterials } from './consumedMaterials.type';

export type RefineParamsResult = {
  readonly id: string;
  readonly refineConsumedMaterials?: ConsumedMaterials;
  readonly refineCost: number;
  readonly refineParams: RefineParameters;
  readonly totalConsumedMaterials?: ConsumedMaterials;
  //  Total cost is amount of zeny to get current refine item to target level
  readonly totalCost: number;
  //  Total item cost is total amount of zeny of item at +0 plus all refines, including those before starting level
  readonly totalItemCost: number;
}

export type TotalRefineResult = {
  readonly refineLevel: number;
  readonly refineParamsResults: Map<string, RefineParamsResult>;
  readonly bestRefineParamsId: string;
  readonly usedRefineParamsId: string;
};