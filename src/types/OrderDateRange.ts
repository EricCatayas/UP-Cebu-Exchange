interface OrderDateRange {
  startDate: Date;
  endDate: Date;
  remainingDays?: number;
  status: string;
  statusColor?: string;
}

export type { OrderDateRange };
