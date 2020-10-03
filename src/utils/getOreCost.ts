import { refineItemIds } from '../constants/refineItemIds';

const getBaseOreCost = (oreId: number, costs: Map<number, number>): number => {
  const cost = costs.get(oreId);

  if (cost === undefined) {
    throw new Error(`Cost for item with it: ${oreId} is missing`);
  }

  return cost;
}

export const getOreCost = (oreId: number, costs: Map<number, number>): number => {
  switch (oreId) {
    case refineItemIds.Phracon:
    case refineItemIds.Emveretarcon:
    case refineItemIds.Oridecon:
    case refineItemIds.Elunium:
      return costs.get(oreId);

    case refineItemIds.EnrichedOridecon:
      return costs.get(refineItemIds.Oridecon) + 500_000;

    case refineItemIds.EnrichedElunium:
      return costs.get(refineItemIds.Elunium) + 500_000;

    case refineItemIds.HDOridecon:
      return costs.get(refineItemIds.Elunium) + 1_500_000;

    case refineItemIds.HDElunium:
      return costs.get(refineItemIds.Elunium) + 1_500_000;

    default:
      throw new Error(`Unknown ore: ${oreId}`);
  }
}