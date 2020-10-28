import { ExtraAtk } from '../types/extraAtk.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { Target } from '../types/reductions.type';
import { PropertyElement } from '../types/propertyElement';
import { getPropertyMultiplier } from './getPropertyMultiplier';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly extraAtk: ExtraAtk;
  readonly target: Target;
  readonly weaponElement: PropertyElement
};

export const getExtraAtk = ({
  atkMultipliers,
  extraAtk,
  target,
  weaponElement,
}: Params): number => {
  const propertyMultiplier = getPropertyMultiplier(weaponElement, target.property);
  const totalAtkMultiplier = atkMultipliers.race
    * atkMultipliers.size
    * atkMultipliers.targetProperty
    * atkMultipliers.monster
    * atkMultipliers.atk
    * propertyMultiplier;

  const totalAtkReductionMultiplier = target.atkReductionMultiplier.race
    * target.atkReductionMultiplier.size
    * target.atkReductionMultiplier.property
    * target.atkReductionMultiplier.targetProperty;

  const totalMultipliers = totalAtkMultiplier * totalAtkReductionMultiplier;
  const totalExtraAtk = extraAtk.ammunition
    + extraAtk.consumable
    + extraAtk.equip
    + extraAtk.pseudoBuff;

  return totalExtraAtk * totalMultipliers;
};