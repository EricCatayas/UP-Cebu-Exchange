export function getConversionRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  const result = (numerator / denominator) * 100;
  return result > 100 ? 100 : parseFloat(result.toFixed(2));
}
