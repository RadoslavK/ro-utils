import { Def } from './def.type';
import { AtkReductionMultiplier } from './atkReductions.type';
import { Property } from './property.type';

export type Reductions = {
  readonly atkMultiplier: AtkReductionMultiplier;
  readonly def: Def;
  readonly property: Property;
};