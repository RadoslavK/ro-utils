import { elementTable } from '../constants/elementTable/elementTable';
import { PropertyElement } from '../types/propertyElement';
import { Reductions } from '../types/reductions.type';

export const getPropertyMultiplier = (weaponElement: PropertyElement, reductions: Reductions): number =>
  elementTable[reductions.property.level][reductions.property.element][weaponElement] / 100