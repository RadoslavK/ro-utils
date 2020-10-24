import { AspdWeaponType } from './aspdWeaponType';
import { PotAspdModifier } from './potAspdModifier';
import { SkillAspdModifier } from './skillAspdModifier';

export type AspdInput = {
  readonly agi: number;
  readonly baseAspd: number;
  readonly dex: number;
  readonly flatBonus: number;
  readonly penalty: number;
  readonly percentageBonus: number;
  readonly potModifer: PotAspdModifier;
  readonly skillModifier: SkillAspdModifier;
  readonly weaponType: AspdWeaponType;
};