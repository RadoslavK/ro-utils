import { RefineType } from './refineType.type';

export type RefineInput = {
  readonly baseItemCost: number;
  readonly refineType: RefineType;
  readonly startingRefineLevel: number,
  readonly targetRefineLevel: number,
};