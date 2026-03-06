import { AddressDTO } from '@/models/Address';

export const fmtDate = (d: string | Date) => {
  if (!d) return '';
  if (typeof d === 'string') {
    d = new Date(d);
  }
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const fmtMonth = (d: number) => {
  const date = new Date();
  date.setMonth(d - 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
};

export const fmtMoney = (amount: string | number) => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const fmtAddress = (address: AddressDTO) => {
  if (!address) return '';
  const { city, province, postalCode, addressLine1, addressLine2 } = address;
  return `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${province} ${postalCode}`;
};
