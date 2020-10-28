import { Variance } from './variance.type';

export type Damage = {
  readonly averaged: Variance;
  readonly crit: Variance;
  readonly nonCrit: Variance;
};