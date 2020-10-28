import { DamageType } from './damageType';
import { PropertyElement } from './propertyElement';

export type Weapon = {
  readonly baseDamage: number;
  readonly damageType: DamageType;
  readonly element: PropertyElement;
  readonly level: number;
  readonly refineLevel: number;
};