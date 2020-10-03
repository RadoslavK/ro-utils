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
  readonly items?: ConsumedItem;
};

export type TotalConsumedMaterials = ConsumedMaterialsBase & {
  readonly baseItems: number;
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

export const addConsumedMaterials = (...materials: readonly ConsumedMaterials[]): ConsumedMaterials =>
  materials.reduce((total, current) => {
    if (!total.items) {
      return {
        ...addConsumedMaterialsBase(total, current),
        items: current.items,
      };
    }

    if (!current.items) {
      return {
        ...addConsumedMaterialsBase(total, current),
        items: total.items,
      };
    }

    if (total.items.refineLevel !== current.items.refineLevel) {
      throw new Error('Adding different refine levels');
    }

    return ({
      ...addConsumedMaterialsBase(total, current),
      items: {
        refineLevel: current.items.refineLevel,
        amount: total.items.amount + current.items.amount,
      },
    });
  }, createConsumedMaterials());

export const multiplyConsumedMaterialsBase = (materials: ConsumedMaterialsBase, multiplier: number): ConsumedMaterialsBase => ({
  bsb: materials.bsb * multiplier,
  enrichedOre: materials.enrichedOre * multiplier,
  hdOre: materials.hdOre * multiplier,
  normalOre: materials.normalOre * multiplier,
  refineBox: materials.refineBox * multiplier,
});