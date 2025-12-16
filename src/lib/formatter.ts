export const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

export const fmtMoney = (amount: string | number) => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
