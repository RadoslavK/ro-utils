import { ExtraAtk } from '../types/extraAtk.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { Reductions } from '../types/reductions.type';
import { PropertyElement } from '../types/propertyElement';
import { getPropertyMultiplier } from './getPropertyMultiplier';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly extraAtk: ExtraAtk;
  readonly reductions: Reductions;
  readonly weaponElement: PropertyElement
};

export const getExtraAtk = ({
  atkMultipliers,
  extraAtk,
  reductions,
  weaponElement,
}: Params): number => {
  const propertyMultiplier = getPropertyMultiplier(weaponElement, reductions);
  const totalAtkMultiplier = atkMultipliers.race
    * atkMultipliers.size
    * atkMultipliers.targetProperty
    * atkMultipliers.monster
    * atkMultipliers.atk
    * propertyMultiplier;

  const totalAtkReductionMultiplier = reductions.atkMultiplier.race
    * reductions.atkMultiplier.size
    * reductions.atkMultiplier.property
    * reductions.atkMultiplier.targetProperty;

  const totalMultipliers = totalAtkMultiplier * totalAtkReductionMultiplier;
  const totalExtraAtk = extraAtk.ammunition
    + extraAtk.consumable
    + extraAtk.equip
    + extraAtk.pseudoBuff;

  return totalExtraAtk * totalMultipliers;
};