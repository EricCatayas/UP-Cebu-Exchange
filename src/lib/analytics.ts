import { PopularityScore, PopularityScoreWeights } from '@/types/analytics';

export function getConversionRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  const result = (numerator / denominator) * 100;
  return result > 100 ? 100 : parseFloat(result.toFixed(2));
}

export function calculatePopularityScore(score: PopularityScore, weights: PopularityScoreWeights): number {
  return (
    score.rentedCount * weights.rentedCount +
    score.orderCount * weights.orderCount +
    score.wishlistCount * weights.wishlistCount +
    score.cartCount * weights.cartCount +
    score.viewCount * weights.viewCount
  );
}
