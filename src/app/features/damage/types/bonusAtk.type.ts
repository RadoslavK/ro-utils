import { ExtraAtk } from './extraAtk.type';

export type BonusAtk = {
  readonly extraAtk: ExtraAtk;
  readonly masteryAtk: number;
  readonly buffAtk: number;
};