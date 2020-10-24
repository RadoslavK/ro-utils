import { Class } from '../types/class';
import { PotAspdModifier } from '../types/potAspdModifier';

export const allowedPots: Record<Class, readonly PotAspdModifier[]> = {
  [Class.Novice]: [PotAspdModifier.ConcentrationPotion],

  [Class.Archer]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion],
  [Class.Bard]: [PotAspdModifier.ConcentrationPotion],
  [Class.Dancer]: [PotAspdModifier.ConcentrationPotion],
  [Class.Hunter]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion],

  [Class.Swordman]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],
  [Class.Knight]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],
  [Class.Crusader]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],

  [Class.Merchant]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],
  [Class.Blacksmith]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],
  [Class.Alchemist]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],

  [Class.Mage]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],
  [Class.Wizard]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],
  [Class.Sage]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion],

  [Class.Acolyte]: [PotAspdModifier.ConcentrationPotion],
  [Class.Priest]: [PotAspdModifier.ConcentrationPotion],
  [Class.Monk]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion],

  [Class.Thief]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion],
  [Class.Assassin]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion],
  [Class.Rogue]: [PotAspdModifier.ConcentrationPotion, PotAspdModifier.AwakeningPotion, PotAspdModifier.BerserkPotion],
};