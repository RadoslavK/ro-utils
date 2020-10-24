import { SkillAspdModifier } from '../types/skillAspdModifier';

export const getSkillBonus = (skillModifier: SkillAspdModifier): number => {
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