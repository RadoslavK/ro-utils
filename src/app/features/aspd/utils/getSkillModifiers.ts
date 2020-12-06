import { Class } from '../types/class';
import { SkillAspdModifier } from '../types/skillAspdModifier';
import { Equip } from '../types/equip';

const weaponsEligibleForAdrenalineRush: readonly Equip[] = [
  Equip.OneHandAxe,
  Equip.TwoHandAxe,
  Equip.Mace,
];

const getClassBasedModifiers = (characterClass: Class, equip: Equip[]): readonly SkillAspdModifier[] => {
  switch (characterClass) {
    case Class.Crusader:
      return [Equip.OneHandSpear, Equip.TwoHandSpear].some(w => equip.includes(w))
        ? [SkillAspdModifier.SpearQuicken]
        : [];

    case Class.Knight: {
      if (equip.includes(Equip.TwoHandSword)) {
        return [SkillAspdModifier.TwoHandQuicken];
      }

      if (equip.includes(Equip.OneHandSword)) {
        return [SkillAspdModifier.OneHandQuicken];
      }

      return [];
    }

    case Class.Blacksmith: {
      const canUseAdrenalineRush = weaponsEligibleForAdrenalineRush.some(w => equip.includes(w));

      return canUseAdrenalineRush
        ? [SkillAspdModifier.AdrenalineRushSelf]
        : [];
    }

    case Class.Acolyte:
    case Class.Alchemist:
    case Class.Archer:
    case Class.Assassin:
    case Class.Bard:
    case Class.Dancer:
    case Class.Hunter:
    case Class.Mage:
    case Class.Merchant:
    case Class.Monk:
    case Class.Novice:
    case Class.Priest:
    case Class.Rogue:
    case Class.Sage:
    case Class.Swordman:
    case Class.Thief:
    case Class.Wizard:
      return [];

    default:
      throw new Error(`Invalid class: ${characterClass}`);
  }
}

export function getSkillModifiers(characterClass: Class, equip: Equip[]): ReadonlySet<SkillAspdModifier> {
  const classBasedModifiers = getClassBasedModifiers(characterClass, equip);
  const canUseAdrenalineRush = weaponsEligibleForAdrenalineRush.some(w => equip.includes(w));
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