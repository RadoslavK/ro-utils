import { PotAspdModifier } from '../types/potAspdModifier';

export const getPotBonus = (potModifier: PotAspdModifier): number => {
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