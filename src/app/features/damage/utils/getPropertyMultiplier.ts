import { elementTable } from '../constants/elementTable/elementTable';
import { PropertyElement } from '../types/propertyElement';
import { Property } from '../types/property.type';

export const getPropertyMultiplier = (weaponElement: PropertyElement, targetProperty: Property): number =>
  elementTable[targetProperty.level][targetProperty.element][weaponElement] / 100