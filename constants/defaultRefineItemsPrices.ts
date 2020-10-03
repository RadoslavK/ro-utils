import { refineItemIds } from './refineItemIds';

export const defaultRefineItemsPrices = new Map<number, number>([
  [refineItemIds.Elunium, 2_000],
  [refineItemIds.Oridecon, 5_000],
  [refineItemIds.BlacksmithBlessing, 3_600_000],
  [refineItemIds.Phracon, 100],
  [refineItemIds.Emveretarcon, 1_000],
  [refineItemIds.RandomRefineBox, 4_000_000],
]);