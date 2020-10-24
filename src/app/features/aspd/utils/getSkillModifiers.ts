import { Class } from '../types/class';
import { SkillAspdModifier } from '../types/skillAspdModifier';
import { Equip } from '../types/equip';

const weaponsEligibleForAdrenalineRush: readonly Equip[] = [
  Equip.OneHandAxe,
  Equip.TwoHandAxe,
  Equip.Mace,
];

const getClassBasedModifiers = (characterClass: Class, canUseAdrenalineRush: boolean): readonly SkillAspdModifier[] => {
  switch (characterClass) {
    case Class.Crusader:
      return [SkillAspdModifier.SpearQuicken];

    case Class.Knight:
      return [SkillAspdModifier.TwoHandQuicken, SkillAspdModifier.OneHandQuicken];

    case Class.Blacksmith:
      return canUseAdrenalineRush
        ? [SkillAspdModifier.AdrenalineRushSelf]
        : [];

    default:
      return [];
  }
}

export function getSkillModifiers(characterClass: Class, equip: Equip[]): ReadonlySet<SkillAspdModifier> {
  const canUseAdrenalineRush = weaponsEligibleForAdrenalineRush.some(w => equip.includes(w));
  const classBasedModifiers = getClassBasedModifiers(characterClass, canUseAdrenalineRush);
  const generalModifiers: SkillAspdModifier[] = [];

  if (characterClass !== Class.Blacksmith && canUseAdrenalineRush) {
    generalModifiers.push(SkillAspdModifier.AdrenalineRush);
  }

  return new Set<SkillAspdModifier>([
    SkillAspdModifier.None,
    ...generalModifiers,
    ...classBasedModifiers,
  ]);
}