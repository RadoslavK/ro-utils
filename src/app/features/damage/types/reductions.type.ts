import { Def } from './def.type';
import { AtkReductionMultiplier } from './atkReductions.type';
import { Property } from './property.type';
import { Size } from './size';

export type Target = {
  readonly atkReductionMultiplier: AtkReductionMultiplier;
  readonly def: Def;
  readonly property: Property;
  readonly size: Size;
};