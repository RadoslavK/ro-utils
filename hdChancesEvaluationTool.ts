const getLowestFraction = (x0) => {
  const eps = 1.0E-15;
  let h, h1, h2, k, k1, k2, a, x;

  x = x0;
  a = Math.floor(x);
  h1 = 1;
  k1 = 0;
  h = a;
  k = 1;

  while (x-a > eps*k*k) {
    x = 1/(x-a);
    a = Math.floor(x);
    h2 = h1; h1 = h;
    k2 = k1; k1 = k;
    h = h2 + a*h1;
    k = k2 + a*k1;
  }

  return { h, k };
};

const chance1 = 40;
const chance2 = 70;
const shouldBreak2 = true;

const { h: succSize1, k: blockSize1 } = getLowestFraction(chance1 / 100);
const failSize1 = blockSize1 - succSize1;

const { h: succSize2, k: blockSize2 } = getLowestFraction(chance2 / 100);
const failsize2 = blockSize2 - succSize2;

let total1 = 0;
let succ1 = 0;
let fails1 = 0;

let total2 = 0;
let succ2 = 0;
let fails2 = 0;

let token = 1;

do {
  if (token === 1) {
    if (fails1 < failSize1) {
      total1++;
      fails1++;
      token = 2;
    } else if (succ1 < succSize1) {
      total1++;
      succ1++;

      if (total1 % blockSize1 === 0 && total2 % blockSize2 === 0) {
        break;
      }
    } else if (succ1 === succSize1) {
      succ1 = 0;
      fails1 = 0;
    }
  }
  else if (token === 2) {
    if (fails2 < failsize2) {
      total2++;
      fails2++;
    }
    else if (succ2 < succSize2) {
      total2++;
      succ2++;
      token = 1;
    } else if (succ2 === succSize2) {
      succ2 = 0;
      fails2 = 0;
    }
  }
} while (true);

const totalSucc1 = total1 * chance1 / 100;
const totalSucc2 = total2 * chance2 / 100;

const avg1AttemptsPerSucess1 = total1 / totalSucc1;
const avg2AttemptsPerSuccess1 = total2 / totalSucc1;

const totalBroken2 = shouldBreak2
  ? total2 * (1 - chance2 / 100)
  : 0;

const avgBroken2PerSuccess1 = totalBroken2 / totalSucc1;

// correction check
const avgBroken2PerSuccess1DifferentMethod = avg2AttemptsPerSuccess1 - (avg1AttemptsPerSucess1 - 1);

console.log('totalSucc1: ' + totalSucc1);
console.log('totalSucc2: ' + totalSucc2);
console.log('total1: ' + total1);
console.log('total2: ' + total2);
console.log();
console.log('avg1AttemptsPerSucess1: ' + avg1AttemptsPerSucess1);
console.log('avg2AttemptsPerSuccess1: ' + avg2AttemptsPerSuccess1);
console.log('avgBroken2PerSuccess1: ' + avgBroken2PerSuccess1);
console.log('avgBroken2PerSuccess1DifferentMethod: ' + avgBroken2PerSuccess1DifferentMethod);