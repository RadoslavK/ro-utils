import { ElementLevelTable } from '../../types/propertyElement';
import { level1Table } from './level1Table';
import { level2Table } from './level2Table';
import { level3Table } from './level3Table';
import { level4Table } from './level4Table';
import { ElementLevel } from '../../types/elementLevel';

export const elementTable: Record<ElementLevel, ElementLevelTable> = {
  1: level1Table,
  2: level2Table,
  3: level3Table,
  4: level4Table,
};