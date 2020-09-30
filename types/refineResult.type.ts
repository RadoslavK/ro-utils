import { ConsumedMaterials } from './consumedMaterials.type';

export type RefineResult = {
  readonly attemptConsumedMaterials: ConsumedMaterials;
  readonly attemptCost: number;
  readonly downgradedTimes: number;
  readonly refineAttempts: number;
  readonly refineLevel: number;
  readonly totalConsumedMaterials: ConsumedMaterials;
  readonly totalCost: number;
};