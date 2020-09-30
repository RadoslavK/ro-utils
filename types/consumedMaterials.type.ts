export const mergeItemsOfRefine = (...items: readonly Map<number, number>[]): Map<number, number> =>
  items.reduce((merged, current) => {
    const newMap = new Map<number, number>(merged);

    for (const [key, value] of current.entries()) {
      newMap.set(key, (newMap.get(key) || 0) + value);
    }

    return newMap;
  }, new Map<number, number>()
);

export const multiplyItemsOfRefine = (items: Map<number, number>, multiplier: number): Map<number, number> =>
  new Map<number, number>([...items.entries()].map(
    ([key, value]) => [key, value * multiplier],
  ));

export type ConsumedMaterials = {
  readonly itemsOfRefine: Map<number, number>;
  readonly bsb: number;
  readonly enrichedOre: number;
  readonly hdOre: number;
  readonly normalOre: number;
};

export const createConsumedMaterials = (params: Partial<ConsumedMaterials> = {}): ConsumedMaterials => ({
  bsb: params.bsb || 0,
  enrichedOre: params.enrichedOre || 0,
  hdOre: params.hdOre || 0,
  itemsOfRefine: params.itemsOfRefine || new Map<number, number>(),
  normalOre: params.normalOre || 0,
});

export const addConsumedMaterials = (...materials: readonly ConsumedMaterials[]): ConsumedMaterials => {
  return materials.reduce((total, current) => ({
    bsb: total.bsb + current.bsb,
    enrichedOre: total.enrichedOre + current.enrichedOre,
    hdOre: total.hdOre + current.hdOre,
    itemsOfRefine: mergeItemsOfRefine(total.itemsOfRefine, current.itemsOfRefine),
    normalOre: total.normalOre + current.normalOre,
  }), createConsumedMaterials());
};

export const multiplyConsumedMaterials = (materials: ConsumedMaterials, multiplier: number): ConsumedMaterials => ({
  bsb: materials.bsb * multiplier,
  enrichedOre: materials.enrichedOre * multiplier,
  hdOre: materials.hdOre * multiplier,
  itemsOfRefine: multiplyItemsOfRefine(materials.itemsOfRefine, multiplier),
  normalOre: materials.normalOre * multiplier,
})