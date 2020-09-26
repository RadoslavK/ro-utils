import { RefineType } from './types/refineType.type';
import { calculateTotalRefineCost } from './calculations/calculateTotalRefineCost';

const {
  totalRefineResults,
  refineResults,
} = calculateTotalRefineCost({
  baseCost: 2_000_000,
  startingRefineLevel: 0,
  targetRefineLevel: 10,
  refineType: RefineType.Armor,
});

console.log(refineResults);
console.log(totalRefineResults);