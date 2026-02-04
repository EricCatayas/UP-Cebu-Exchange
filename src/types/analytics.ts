export interface FunnelMetrics {
  [event: string]: {
    count: number;
    conversionRate: number;
    cumulativeConversionRate: number;
  };
}

export interface MilestoneMetrics {
  [event: string]: {
    hasReached: boolean;
    reachedAt?: Date;
  };
}

export interface PaymentMetrics {
  revenue: {
    total: number;
    monthly: number;
    annual: number;
  };
  statusBreakdown: {
    [status: string]: {
      count: number;
      amount: number;
      percentage: number;
    };
  };
}

export interface PopularityScore {
  rentedCount: number;
  orderCount: number;
  wishlistCount: number;
  cartCount: number;
  viewCount: number;
}

export interface PopularityScoreWeights {
  [key: string]: number;
}
