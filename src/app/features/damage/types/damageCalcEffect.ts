export enum EquipPosition {
  HgUpper = 'Upper Headgear',
  HgMiddle = 'Middle Headgear',
  HgLower = 'Lower Headgear',
  Armor = 'Armor',
  HandRight = 'Weapon',
  HandLeft = 'Shield/Weapon',
  Garment = 'Garment',
  Boots = 'Boots',
  AccessoryRight = 'Accessory (Right)',
  AccessoryLeft = 'Accessory (Left)',
}

export enum EquipEffectType {
  MasteryATK = 'Mastery ATK',
  EquipATK = 'ATK',
  AmmunitionATK = 'Ammunition ATK',

  ATK = 'ATK %',
  Monster = 'Monster %',
  Race = 'Race %',
  Size = 'Size %',
  Property = 'Property %',
  Damage = 'Damage %',
  FinalDamage = 'Final Damage %',
  Ranged = 'Long Range Damage %',
  Crit = 'Crit Damage %',
  SkillDamage = 'Skill Damage %',
}

export enum ExtraEffectType {
  ConsumableATK = 'Consumable ATK',
  PseudoBuffATK = 'Pseudo-Buff ATK',
}

export type DamageCalcEffectValue<TEffectType> = {
  readonly type: TEffectType;
  readonly value: number;
}

type DamageCalcEffectBase<TEffectType> = {
  readonly id: string;
  readonly name: string;
  readonly values: readonly DamageCalcEffectValue<TEffectType>[];
};

export type EquipEffect = DamageCalcEffectBase<EquipEffectType> & {
  readonly positions: readonly EquipPosition[];
};

export type ExtraEffect = DamageCalcEffectBase<ExtraEffectType>;

export type DamageCalcEffect = EquipEffect | ExtraEffect;