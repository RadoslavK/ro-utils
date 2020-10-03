const refineBoxChances: Record<string, number> = {
  5: 43.9,
  6: 35,
  7: 15,
  8: 5,
  9: 1,
  10: 0.1,
};

let cumulativeChance = 0;

export const cumulativeRefineBoxChances = Object
  .keys(refineBoxChances)
  .reverse()
  .reduce((reduced, refineLevel) => {
    cumulativeChance += refineBoxChances[refineLevel];

    return {
      ...reduced,
      [refineLevel]: cumulativeChance,
    };
  }, {} as Record<number, number>);