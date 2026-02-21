export type GenerateConfig = {
  n: number;
  min: number;
  max: number;
  avgTarget: number;
  tolerance: number;
  roundTo: number;
};

const roundStep = (v: number, step: number) => Math.round(v / step) * step;
const randInt = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const mean = (arr: number[]) => arr.reduce((s, n) => s + n, 0) / arr.length;

export function validateConfig(c: GenerateConfig) {
  if (c.n <= 0) return "N phải lớn hơn 0";
  if (c.min > c.max) return "MIN_AMOUNT không thể lớn hơn MAX_AMOUNT";
  if (c.roundTo <= 0) return "ROUND_TO phải lớn hơn 0";
  const low = c.avgTarget * (1 - c.tolerance);
  const high = c.avgTarget * (1 + c.tolerance);
  if (high < c.min || low > c.max) return "AVG_TARGET ± tolerance nằm ngoài dải MIN/MAX => cấu hình không khả thi";
  return null;
}

export function generateAmounts(config: GenerateConfig): number[] {
  const err = validateConfig(config);
  if (err) throw new Error(err);
  const { n, min, max, avgTarget, tolerance, roundTo } = config;
  const low = avgTarget * (1 - tolerance);
  const high = avgTarget * (1 + tolerance);

  let arr = Array.from({ length: n }, () => roundStep(randInt(min, max), roundTo));
  for (let k = 0; k < 2000; k++) {
    const avg = mean(arr);
    if (avg >= low && avg <= high) return arr;
    const idx = randInt(0, n - 1);
    if (avg < low) arr[idx] = Math.min(max, arr[idx] + roundTo);
    else arr[idx] = Math.max(min, arr[idx] - roundTo);
  }

  const targetLow = Math.ceil((low * n) / roundTo) * roundTo;
  const targetHigh = Math.floor((high * n) / roundTo) * roundTo;
  if (targetLow > targetHigh) throw new Error("Không thể tạo tổng tiền phù hợp tolerance");
  const steps = Math.floor((targetHigh - targetLow) / roundTo);
  const targetSum = targetLow + randInt(0, steps) * roundTo;

  const result: number[] = [];
  let remaining = targetSum;
  for (let i = 0; i < n; i++) {
    const left = n - i - 1;
    const minRemain = left * min;
    const maxRemain = left * max;
    const localMin = Math.max(min, remaining - maxRemain);
    const localMax = Math.min(max, remaining - minRemain);
    const minS = Math.ceil(localMin / roundTo);
    const maxS = Math.floor(localMax / roundTo);
    if (minS > maxS) throw new Error("Fallback thất bại do ràng buộc rounding");
    const val = randInt(minS, maxS) * roundTo;
    result.push(val);
    remaining -= val;
  }
  if (remaining !== 0) throw new Error("Không cân bằng tổng tiền");
  return result;
}

export function summarize(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted[Math.floor(sorted.length / 2)];
  const avg = mean(values);
  return {
    min: sorted[0],
    median: mid,
    max: sorted[sorted.length - 1],
    avg,
    histogram: Object.entries(values.reduce<Record<string, number>>((acc, n) => {
      acc[n] = (acc[n] || 0) + 1;
      return acc;
    }, {})).map(([amount, count]) => ({ amount: Number(amount), count })).sort((a, b) => a.amount - b.amount)
  };
}
