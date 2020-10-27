import { ExtraAtk } from '../types/extraAtk.type';
import { AtkReductions } from '../types/atkReductions.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly atkReductions: AtkReductions;
  readonly extraAtk: ExtraAtk;
};

const getKeyName = <T>(key: keyof T): keyof T => key;

export const getExtraAtk = ({
  atkMultipliers,
  atkReductions,
  extraAtk,
}: Params): number => {
  const totalAtkReductions = Object
    .entries(atkReductions)
    .filter(([reductionType]) => reductionType !== getKeyName<AtkReductions>('sizePenalty'))
    .map(([, reduction]) => reduction)
    .reduce((reduced, reduction) => reduced * reduction, 1);
  const totalAtkMultipliers = Object
    .values(atkMultipliers)
    .reduce((reduced, reduction) => reduced * reduction, 1);
  const totalMultipliers = totalAtkReductions * totalAtkMultipliers;
  const totalExtraAtk = Object
    .values(extraAtk)
    .reduce((reduced, extraAtkPart) => reduced + extraAtkPart, 0);

  return totalExtraAtk * totalMultipliers;
};