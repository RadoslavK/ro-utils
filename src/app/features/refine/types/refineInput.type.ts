import { RefineType } from './refineType.type';

export type RefineInput = {
  readonly baseItemCost: number;
  readonly maxRefineBoxLevel: number;
  readonly refineType: RefineType;
  readonly targetRefineLevel: number,
};