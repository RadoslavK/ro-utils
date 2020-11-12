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

export type ConsumedMaterialsBase = {
  readonly bsb: number;
  readonly enrichedOre: number;
  readonly hdOre: number;
  readonly normalOre: number;
  readonly refineBox: number;
};

type ConsumedItem = {
  readonly amount: number;
  readonly refineLevel: number;
}

export type ConsumedMaterials = ConsumedMaterialsBase & {
  readonly items: ConsumedItem | undefined;
};

export const createConsumedMaterialsBase = (params: Partial<ConsumedMaterialsBase> = {}): ConsumedMaterialsBase => ({
  bsb: params.bsb || 0,
  enrichedOre: params.enrichedOre || 0,
  hdOre: params.hdOre || 0,
  normalOre: params.normalOre || 0,
  refineBox: params.refineBox || 0,
});

export const createConsumedMaterials = (params: Partial<ConsumedMaterials> = {}): ConsumedMaterials => ({
  ...createConsumedMaterialsBase(params),
  items: params.items,
});

export const addConsumedMaterialsBase = (...materials: readonly ConsumedMaterialsBase[]): ConsumedMaterialsBase =>
  materials.reduce((total, current) => ({
    bsb: total.bsb + current.bsb,
    enrichedOre: total.enrichedOre + current.enrichedOre,
    hdOre: total.hdOre + current.hdOre,
    normalOre: total.normalOre + current.normalOre,
    refineBox: total.refineBox + current.refineBox,
  }), createConsumedMaterialsBase());

export const addItems = (items: ConsumedItem | undefined, addition: ConsumedItem | undefined): ConsumedItem | undefined => {
  if (!items) {
    return addition;
  }

  if (!addition) {
    return items;
  }

  if (items.refineLevel !== addition.refineLevel) {
    throw new Error('Adding different refine levels');
  }

  return {
    refineLevel: items.refineLevel,
    amount: items.amount + addition.amount,
  }
};

export const multiplyItems = (items: ConsumedItem | undefined, multiplier: number): ConsumedItem | undefined =>
  items && ({
    refineLevel: items.refineLevel,
    amount: items.amount * multiplier,
  });

export const addConsumedMaterials = (...materials: readonly ConsumedMaterials[]): ConsumedMaterials =>
  materials.reduce((total, current) => ({
    ...addConsumedMaterialsBase(total, current),
    items: addItems(total.items, current.items),
  }), createConsumedMaterials());

export const multiplyConsumedMaterialsBase = (materials: ConsumedMaterialsBase, multiplier: number): ConsumedMaterialsBase => ({
  bsb: materials.bsb * multiplier,
  enrichedOre: materials.enrichedOre * multiplier,
  hdOre: materials.hdOre * multiplier,
  normalOre: materials.normalOre * multiplier,
  refineBox: materials.refineBox * multiplier,
});

export const multiplyConsumedMaterials = (materials: ConsumedMaterials, multiplier: number): ConsumedMaterials => ({
  ...multiplyConsumedMaterialsBase(materials, multiplier),
  items: multiplyItems(materials.items, multiplier),
});