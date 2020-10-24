import { aspdPenalties } from '../constants/aspdPenalties';
import { Equip } from '../types/equip';
import { Class } from '../types/class';

type Params = {
  readonly characterClass: Class;
  readonly leftHandEquip: Equip
  readonly rightHandEquip: Equip;
};

export const getAspdPenalty = ({
  characterClass,
  leftHandEquip,
  rightHandEquip,
}: Params): number =>
  [...new Set<Equip>([leftHandEquip, rightHandEquip])
    .values()]
    .reduce((penalty, equipPiece) =>
      penalty + aspdPenalties[characterClass][equipPiece] || 0, 0);