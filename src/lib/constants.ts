export const APP_NAME = 'UP Cebu Exchange';

export enum ARTWORK_MEDIUM {
  OIL_ON_CANVAS = 'Oil on canvas',
  ACRYLIC_ON_CANVAS = 'Acrylic on canvas',
  WATERCOLOR_ON_PAPER = 'Watercolor on paper',
  DIGITAL_PRINT = 'Digital print',
  MIXED_MEDIA = 'Mixed media',
  CHARCOAL_ON_PAPER = 'Charcoal on paper',
  PENCIL_ON_PAPER = 'Pencil on paper',
}

export const ARTWORK_MEDIUMS = [
  ARTWORK_MEDIUM.OIL_ON_CANVAS,
  ARTWORK_MEDIUM.ACRYLIC_ON_CANVAS,
  ARTWORK_MEDIUM.WATERCOLOR_ON_PAPER,
  ARTWORK_MEDIUM.DIGITAL_PRINT,
  ARTWORK_MEDIUM.MIXED_MEDIA,
  ARTWORK_MEDIUM.CHARCOAL_ON_PAPER,
  ARTWORK_MEDIUM.PENCIL_ON_PAPER,
];

export enum ARTWORK_STATUS {
  AVAILABLE = 'Available',
  RENTED = 'Rented',
  UNAVAILABLE = 'Unavailable',
}

export const ARTWORK_STATUSES = [ARTWORK_STATUS.AVAILABLE, ARTWORK_STATUS.RENTED, ARTWORK_STATUS.UNAVAILABLE];

export const CURRENCY_SYMBOL = '₱';

export const DELIVERY_FEE = 50;

export enum DELIVERY_METHOD {
  DELIVERY = 'Delivery',
  PICKUP = 'Pickup',
}

export const DELIVERY_METHODS = [DELIVERY_METHOD.DELIVERY, DELIVERY_METHOD.PICKUP];

export const DURATION_OPTIONS = [3, 6, 12];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export enum ORDER_STATUS {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export const ORDER_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
];

export enum PAYMENT_METHOD {
  CASH = 'Cash',
  CREDIT_CARD = 'Credit Card',
  BANK_TRANSFER = 'Bank Transfer',
}

export const PAYMENT_METHODS = [PAYMENT_METHOD.CASH, PAYMENT_METHOD.CREDIT_CARD, PAYMENT_METHOD.BANK_TRANSFER];

export enum USER_ROLE {
  // ADMIN = 'admin',
  HEAD = 'head',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum USER_STATUS {
  ACTIVE = 'Active',
  PENDING = 'Pending',
}

export const ADMIN_ROLES = [USER_ROLE.HEAD, USER_ROLE.STAFF];

export const USER_ROLES = [USER_ROLE.HEAD, USER_ROLE.STAFF, USER_ROLE.CUSTOMER];
