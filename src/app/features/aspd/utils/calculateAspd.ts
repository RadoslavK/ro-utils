import { AspdInput } from '../types/aspdInput.type';
import { AspdWeaponType } from '../types/aspdWeaponType';
import { PotAspdModifier } from '../types/potAspdModifier';
import { SkillAspdModifier } from '../types/skillAspdModifier';

const getStatBonus = ({ agi, dex, weaponType }: Pick<AspdInput, 'agi' | 'dex' | 'weaponType'>): number =>
  weaponType === AspdWeaponType.Ranged
    ? Math.sqrt((agi**2) / 2 + (dex**2) / 7) / 4
    : Math.sqrt((agi**2) / 2 + (dex**2) / 5) / 4;

const getPotBonus = (potModifier: PotAspdModifier): number => {
  switch (potModifier) {
    case PotAspdModifier.None:
      return 0;

    case PotAspdModifier.ConcentrationPotion:
      return 4;

    case PotAspdModifier.AwakeningPotion:
      return 6;

    case PotAspdModifier.BerserkPotion:
      return 9;

    default:
      throw new Error(`Unknown ASPD pot modifier ${potModifier}`);
  }
};

const getSkillBonus = (skillModifier: SkillAspdModifier): number => {
  switch (skillModifier) {
    case SkillAspdModifier.None:
      return 0;

    case SkillAspdModifier.AdrenalineRush:
      return 6;

    case SkillAspdModifier.AdrenalineRushSelf:
      return 7;

    case SkillAspdModifier.Berserk:
      return 15;

    case SkillAspdModifier.OneHandQuicken:
    case SkillAspdModifier.SpearQuicken:
    case SkillAspdModifier.TwoHandQuicken:
      return 7;

    default:
      throw new Error(`Unknown ASPD skill modifier ${skillModifier}`);
  }
};

type Result = {
  readonly finalAspd: number;
  readonly finalAspdFull: number;
  readonly statAspd: number;
  readonly statAspdFull: number;
};

export const calculateAspd = ({
  agi,
  baseAspd,
  dex,
  flatBonus,
  penalty,
  percentageBonus,
  potModifer,
  skillModifier,
  weaponType,
}: AspdInput): Result => {
  const statBonus = getStatBonus({ agi, dex, weaponType });
  const statusBonus = getPotBonus(potModifer) + getSkillBonus(skillModifier);
  const potBonus = agi * statusBonus / 200;
  const statAspdFull = baseAspd - penalty + statBonus + potBonus;
  const statAspd = Math.floor(statAspdFull);
  const bonus = (195 - statAspd) * (percentageBonus / 100);
  const finalAspdFull = statAspd + bonus + flatBonus;
  const finalAspd = Math.floor(statAspd + bonus) + flatBonus;

  return {
    finalAspd,
    finalAspdFull,
    statAspd,
    statAspdFull,
  };
};