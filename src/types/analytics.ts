export interface FunnelMetrics {
  [event: string]: {
    count: number;
    conversionRate: number;
    cumulativeConversionRate: number;
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
