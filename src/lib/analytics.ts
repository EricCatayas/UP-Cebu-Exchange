import { PopularityScore, PopularityScoreWeights, FunnelMetrics, MilestoneMetrics } from '@/types/analytics';
import { funnelStages } from '@/lib/labels';

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

export function getFunnelMilestones(funnelMetrics: {
  [event: string]: { count: number; reachedAt?: Date };
}): MilestoneMetrics {
  const milestones: MilestoneMetrics = {};

  // Find the furthest stage reached (last stage with count > 0)
  let furthestStageIndex = -1;

  for (let i = funnelStages.length - 1; i >= 0; i--) {
    const stageValue = funnelStages[i].value;
    if (funnelMetrics[stageValue]?.count > 0) {
      furthestStageIndex = i;
      break;
    }
  }

  // Mark all stages up to and including the furthest stage as reached
  funnelStages.forEach((stage, index) => {
    milestones[stage.value] = {
      hasReached: index <= furthestStageIndex,
      reachedAt: funnelMetrics[stage.value]?.reachedAt || undefined,
    };
  });

  return milestones;
}
