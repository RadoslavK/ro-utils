import { AspdInput } from '../types/aspdInput.type';
import { baseAspd } from '../constants/baseAspd';
import { getAspdPenalty } from './getAspdPenalty';
import { getPotBonus } from './getPotBonus';
import { getSkillBonus } from './getSkillBonus';
import { getStatBonus } from './getStatBonus';
import { isWearingRangedWeapon } from './isWearingRangedWeapon';

type Result = {
  readonly finalAspd: number;
  readonly finalAspdFull: number;
  readonly statAspd: number;
  readonly statAspdFull: number;
};

export const calculateAspd = ({
  agi,
  characterClass,
  dex,
  flatBonus,
  leftHandEquip,
  percentageBonus,
  potModifer,
  rightHandEquip,
  skillModifier,
}: AspdInput): Result => {
  const characterBaseAspd = baseAspd[characterClass];
  const penalty = getAspdPenalty({
    characterClass,
    leftHandEquip,
    rightHandEquip,
  });
  const hasRangedWeapon = isWearingRangedWeapon([leftHandEquip, rightHandEquip]);
  const statBonus = getStatBonus({ agi, dex, hasRangedWeapon });
  const statusBonus = getPotBonus(potModifer) + getSkillBonus(skillModifier);
  const potBonus = agi * statusBonus / 200;
  const statAspdFull = characterBaseAspd - penalty + statBonus + potBonus;
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