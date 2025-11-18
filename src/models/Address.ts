export interface AddressAttributes {
  id: number;
  city: string;
  province: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  createdAt: Date;
  updatedAt: Date;
}
