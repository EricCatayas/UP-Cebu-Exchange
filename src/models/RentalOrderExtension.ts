export interface RentalOrderExtensionAttributes {
  id: number;
  originalOrderId: number;
  extensionOrderId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalOrderExtensionDTO extends RentalOrderExtensionAttributes {
  originalOrder?: any;
  extensionOrder?: any;
}
