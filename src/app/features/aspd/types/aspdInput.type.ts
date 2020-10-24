import { PotAspdModifier } from './potAspdModifier';
import { SkillAspdModifier } from './skillAspdModifier';
import { Class } from './class';
import { Equip } from './equip';

export type AspdInput = {
  readonly agi: number;
  readonly characterClass: Class
  readonly dex: number;
  readonly flatBonus: number;
  readonly leftHandEquip: Equip;
  readonly percentageBonus: number;
  readonly potModifer: PotAspdModifier;
  readonly rightHandEquip: Equip;
  readonly skillModifier: SkillAspdModifier;
};