import { ConsumedMaterials } from './consumedMaterials.type';

export type RefineResult = {
  readonly consumedMaterials: ConsumedMaterials;
  readonly cost: number;
  readonly downgradedTimes?: number;
  readonly refineAttempts: number;
  readonly refineLevel: number;
};