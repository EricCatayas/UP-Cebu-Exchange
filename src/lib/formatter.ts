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
