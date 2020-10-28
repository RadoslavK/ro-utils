import { Variance } from '../types/variance.type';
import { Stats } from '../types/stats.type';
import { getStatusAtk } from './getStatusAtk';
import { getWeaponAtk } from './getWeaponAtk';
import { getExtraAtk } from './getExtraAtk';
import { BonusAtk } from '../types/bonusAtk.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { Weapon } from '../types/weapon.type';
import { Reductions } from '../types/reductions.type';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly reductions: Reductions;
  readonly bonusAtk: BonusAtk;
  readonly stats: Stats;
  readonly weapon: Weapon;
};

export const getAtk = ({
  atkMultipliers,
  bonusAtk,
  reductions,
  stats,
  weapon,
}: Params): Variance => {
  const statusAtk = getStatusAtk(stats, weapon.damageType);
  const weaponAtk = getWeaponAtk({
    atkMultipliers,
    reductions,
    stats,
    weapon,
  });
  const { extraAtk, buffAtk, masteryAtk } = bonusAtk;
  const totalExtraAtk = getExtraAtk({ atkMultipliers, reductions, extraAtk, weaponElement: weapon.element });

  return {
    min: statusAtk * 2 + weaponAtk.min + totalExtraAtk + masteryAtk + buffAtk,
    max: statusAtk * 2 + weaponAtk.max + totalExtraAtk + masteryAtk + buffAtk,
  };
};