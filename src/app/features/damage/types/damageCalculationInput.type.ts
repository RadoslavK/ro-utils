import { Stats } from './stats.type';
import { Weapon } from './weapon.type';
import { Target } from './reductions.type';
import { BonusAtk } from './bonusAtk.type';
import { AtkMultipliers } from './atkMultipliers.type';
import { FinalMultipliers } from './finalMultipliers.type';
import { FinalReductions } from './finalReductions.type';
import { SkillInput } from './skillInput.type';

export type DamageCalculationInput = {
  readonly atkMultipliers: AtkMultipliers;
  readonly bonusAtk: BonusAtk;
  readonly finalMultipliers: FinalMultipliers;
  readonly finalReductions: FinalReductions;
  readonly ignoreSizePenalty: boolean;
  readonly skillInput: SkillInput;
  readonly stats: Stats;
  readonly target: Target;
  readonly useSkill: boolean;
  readonly weapon: Weapon;
};