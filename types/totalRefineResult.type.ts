import { RefineParameters } from './RefineParameters.type';
import { ConsumedMaterials, TotalConsumedMaterials } from './consumedMaterials.type';

export type RefineParamsResultBase = {
  readonly id: string;
  readonly refineParams: RefineParameters;
}

export type RefineParamsResultSuccess = RefineParamsResultBase & {
  readonly consumedMaterials: TotalConsumedMaterials;
  readonly cost: number;
}

export type RefineParamsResultError = RefineParamsResultBase & {
  readonly message: string;
}

export type TotalRefineResult = {
  readonly refineLevel: number;
  readonly refineParamsResults: Map<string, RefineParamsResultSuccess>;
  readonly refineParamsErrors: Map<string, RefineParamsResultError>;
  readonly bestRefineParamsId: string;
  readonly usedRefineParamsId: string;
};