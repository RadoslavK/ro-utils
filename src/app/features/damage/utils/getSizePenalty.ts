import { sizePenalties } from '../constants/sizePenalties';
import { WeaponType } from '../types/weaponType';
import { Size } from '../types/size';

export const getSizePenalty = (weaponType: WeaponType, targetSize: Size): number =>
  sizePenalties[weaponType][targetSize] / 100;