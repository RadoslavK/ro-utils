import { AspdInput } from '../types/aspdInput.type';
import { getSkillModifiers } from './getSkillModifiers';
import { SkillAspdModifier } from '../types/skillAspdModifier';
import { PotAspdModifier } from '../types/potAspdModifier';
import { allowedPots } from '../constants/allowedPots';
import { Equip } from '../types/equip';
import { aspdPenalties } from '../constants/aspdPenalties';

const isSkillModifierValid = ({
  characterClass,
  leftHandEquip,
  rightHandEquip,
  skillModifier,
}: AspdInput): boolean => {
  const validModifiers = getSkillModifiers(characterClass, [leftHandEquip, rightHandEquip]);

  return validModifiers.has(skillModifier);
};

const isPotModifierValid = ({
  characterClass,
  potModifer,
}: AspdInput): boolean =>
  allowedPots[characterClass].includes(potModifer);

const isLeftEquipValidForCurrentClass = ({
  characterClass,
  leftHandEquip
}: AspdInput): boolean =>
  Object.keys(aspdPenalties[characterClass]).includes(leftHandEquip);

const isRightEquipValidForCurrentClass = ({
  characterClass,
  rightHandEquip,
}: AspdInput): boolean =>
  Object.keys(aspdPenalties[characterClass]).includes(rightHandEquip);

export const adjustAspdInput = (input: AspdInput): AspdInput => {
  let adjustedInput: AspdInput = { ...input };

  if (!isLeftEquipValidForCurrentClass(input)) {
    adjustedInput = {
      ...adjustedInput,
      leftHandEquip: Equip.BareHand,
    };
  }

  if (!isRightEquipValidForCurrentClass(input)) {
    adjustedInput = {
      ...adjustedInput,
      rightHandEquip: Equip.BareHand,
    };
  }

  if (!isSkillModifierValid(input)) {
    adjustedInput = {
      ...adjustedInput,
      skillModifier: SkillAspdModifier.None,
    };
  }

  if (!isPotModifierValid(input)) {
    adjustedInput = {
      ...adjustedInput,
      potModifer: PotAspdModifier.None,
    };
  }

  return adjustedInput;
};