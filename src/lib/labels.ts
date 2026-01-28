import { EVENT_NAME } from '@/lib/constants';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';

export const timeframes = [
  { value: '', label: 'All time' },
  { value: '1y', label: 'Past year' },
  { value: '6m', label: 'Past 6 months' },
  { value: '3m', label: 'Past 3 months' },
  { value: '1m', label: 'Past month' },
  { value: '2wk', label: 'Past two weeks' },
  { value: '1d', label: 'Today' },
];

export const timeframeDefault = timeframes[0].value;

export const orderStatus = {
  [ORDER_STATUS.PENDING]: { label: 'Pending', value: ORDER_STATUS.PENDING, color: 'bg-yellow-100 text-yellow-800' },
  [ORDER_STATUS.RESERVED]: { label: 'Reserved', value: ORDER_STATUS.RESERVED, color: 'bg-blue-100 text-blue-800' },
  [ORDER_STATUS.TORECEIVE]: {
    label: 'To Receive',
    value: ORDER_STATUS.TORECEIVE,
    color: 'bg-indigo-100 text-indigo-800',
  },
  ['To Receive Overdue']: { label: 'Overdue Receive', value: 'Overdue Receive', color: 'bg-red-100 text-red-800' },
  [ORDER_STATUS.ONGOING]: { label: 'Ongoing', value: ORDER_STATUS.ONGOING, color: 'bg-purple-100 text-purple-800' },
  [ORDER_STATUS.TORETURN]: { label: 'To Return', value: ORDER_STATUS.TORETURN, color: 'bg-pink-100 text-pink-800' },
  ['Overdue Return']: { label: 'Overdue Return', value: 'Overdue Return', color: 'bg-red-100 text-red-800' },
  ['Payment Pending']: { label: 'Payment Pending', value: 'Payment Pending', color: 'bg-yellow-100 text-yellow-800' },
  ['Payment Failed']: { label: 'Payment Failed', value: 'Payment Failed', color: 'bg-red-100 text-red-800' },
  [ORDER_STATUS.COMPLETED]: { label: 'Completed', value: ORDER_STATUS.COMPLETED, color: 'bg-green-100 text-green-800' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', value: ORDER_STATUS.CANCELLED, color: 'bg-gray-100 text-gray-800' },
};

export const funnelStages = [
  { value: EVENT_NAME.VISIT_SITE, label: 'Visit Site' },
  { value: EVENT_NAME.BROWSE_ARTWORKS, label: 'Browse Artworks' },
  { value: EVENT_NAME.VIEW_ARTWORK, label: 'View Artwork' },
  { value: EVENT_NAME.BEGIN_CHECKOUT, label: 'Begin Checkout' },
  { value: EVENT_NAME.CREATE_ACCOUNT, label: 'Create Account' },
  { value: EVENT_NAME.VERIFY_EMAIL, label: 'Verify Email' },
  { value: EVENT_NAME.SIGN_RENTAL_AGREEMENT, label: 'Sign Agreement' },
  { value: EVENT_NAME.PLACE_ORDER, label: 'Place Order' },
  { value: EVENT_NAME.COMPLETE_PAYMENT, label: 'Complete Payment' },
  { value: EVENT_NAME.COMPLETE_ORDER, label: 'Complete Order' },
];

export const monthOptions = (year: number) => {
  const curr = new Date();
  const months = [];
  const limit = year === curr.getFullYear() ? curr.getMonth() + 1 : 12;
  for (let i = 0; i < limit; i++) {
    months.push({
      value: i + 1,
      label: new Date(year, i).toLocaleDateString('en-US', { month: 'long' }),
    });
  }
  return months;
};

export const yearsOptions = (startYear: number) => {
  const currYear = new Date().getFullYear();
  const years = [];
  for (let y = currYear; y >= startYear; y--) {
    years.push({ value: y, label: y.toString() });
  }
  return years;
};
