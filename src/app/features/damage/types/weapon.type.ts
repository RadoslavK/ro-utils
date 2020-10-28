import { DamageType } from './damageType';
import { PropertyElement } from './propertyElement';
import { WeaponType } from './weaponType';

export type Weapon = {
  readonly baseDamage: number;
  readonly damageType: DamageType;
  readonly element: PropertyElement;
  readonly type: WeaponType;
  readonly level: number;
  readonly refineLevel: number;
};