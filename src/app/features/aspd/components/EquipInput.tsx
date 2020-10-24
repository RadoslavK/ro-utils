import React, { useMemo } from 'react';
import { Equip } from '../types/equip';
import { DropDown } from '../../../components/DropDown';
import { Class } from '../types/class';
import { isLeftHandEquip } from '../utils/isLeftHandEquip';
import { isTwoHandEquip } from '../utils/isTwoHandEquip';
import { aspdPenalties } from '../constants/aspdPenalties';
import { isRightHandEquip } from '../utils/isRightHandEqui[';
import { isDualWieldLeftWeapon } from '../utils/isDualWieldLeftWeapon';
import { isDualWieldRightWeapon } from '../utils/isDualWieldRightWeapon';

export type EquipChanges = {
  readonly leftHand?: Equip;
  readonly rightHand?: Equip;
}

type Props = {
  readonly characterClass: Class;
  readonly leftHandEquip: Equip;
  readonly onChange: (equip: EquipChanges) => void;
  readonly rightHandEquip: Equip;
};

export const EquipInput: React.FC<Props> = ({
  characterClass,
  leftHandEquip,
  onChange,
  rightHandEquip,
}) => {
  const {
    leftHandOptions,
    rightHandOptions,
  } = useMemo(() => {
    const penalties = aspdPenalties[characterClass];
    const leftHandOptions = Object
      .keys(penalties)
      .filter((x: Equip) => isLeftHandEquip(x)
        && (characterClass !== Class.Assassin
          || !isDualWieldLeftWeapon(x)
          || isDualWieldRightWeapon(rightHandEquip))
        || isTwoHandEquip(x)) as readonly Equip[];
    const rightHandOptions = Object
      .keys(penalties)
      .filter((x: Equip) => isRightHandEquip(x)
        || isTwoHandEquip(x)) as readonly Equip[];

    return {
      leftHandOptions: [Equip.BareHand, ...leftHandOptions],
      rightHandOptions: [Equip.BareHand, ...rightHandOptions],
    };
  }, [characterClass]);

  const changeLeftHand = (equip: Equip): void => {
    onChange({
      leftHand: equip,
      rightHand: isTwoHandEquip(equip) ? equip : (isTwoHandEquip(rightHandEquip) ? Equip.BareHand : undefined),
    });
  };

  const changeRightHand = (equip: Equip): void => {
    onChange({
      leftHand: isTwoHandEquip(equip) ? equip : (isTwoHandEquip(leftHandEquip) ? Equip.BareHand : undefined),
      rightHand: equip,
    });
  };

  return (
    <div>
      <DropDown<Equip>
        selectedValue={rightHandEquip}
        values={rightHandOptions}
        onChange={changeRightHand}
        getId={equip => equip}
        getName={equip => equip}
        label="Right Hand Weapon"
      />
      <DropDown<Equip>
        selectedValue={leftHandEquip}
        values={leftHandOptions}
        onChange={changeLeftHand}
        getId={equip => equip}
        getName={equip => equip}
        label="Left Hand Weapon"
      />
    </div>
  );
};