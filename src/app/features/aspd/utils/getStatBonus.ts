type Params = {
  readonly agi: number;
  readonly dex: number;
  readonly hasRangedWeapon: boolean;
}

export const getStatBonus = ({ agi, dex, hasRangedWeapon }: Params): number =>
  hasRangedWeapon
    ? Math.sqrt((agi**2) / 2 + (dex**2) / 7) / 4
    : Math.sqrt((agi**2) / 2 + (dex**2) / 5) / 4;