export interface BillingFeeAttributes {
  id: number;
  rentalOrderId: number | null;
  type?: string;
  label: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingFeeCreateDTO extends Omit<BillingFeeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface BillingFeeDTO extends BillingFeeAttributes {}
