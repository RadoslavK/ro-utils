import { refineItemIds } from '../constants/refineItemIds';

const getBaseOreCost = (costs: Map<number, number>, oreId: number): number => {
  const cost = costs.get(oreId);

  if (cost === undefined) {
    throw new Error(`Cost for item with it: ${oreId} is missing`);
  }

  return cost;
}

export const getOreCost = (oreId: number, itemCosts: Map<number, number>): number => {
  switch (oreId) {
    case refineItemIds.Phracon:
    case refineItemIds.Emveretarcon:
    case refineItemIds.Oridecon:
    case refineItemIds.Elunium:
      return getBaseOreCost(itemCosts, oreId);

    case refineItemIds.EnrichedOridecon:
      return getBaseOreCost(itemCosts, refineItemIds.Oridecon) + 500_000;

    case refineItemIds.EnrichedElunium:
      return getBaseOreCost(itemCosts, refineItemIds.Elunium) + 500_000;

    case refineItemIds.HDOridecon:
      return getBaseOreCost(itemCosts, refineItemIds.Elunium) + 1_500_000;

    case refineItemIds.HDElunium:
      return getBaseOreCost(itemCosts, refineItemIds.Elunium) + 1_500_000;

    default:
      throw new Error(`Unknown ore: ${oreId}`);
  }
}