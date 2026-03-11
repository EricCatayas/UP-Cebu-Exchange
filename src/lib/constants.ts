export const APP_NAME = 'UP Cebu Exchange';
export const APP_EMAIL = process.env.APP_EMAIL; // For system emails and config
export const APP_CONTACT_EMAIL = process.env.APP_CONTACT_EMAIL || 'cebuinit.upcebu@up.edu.ph'; // For contact info
export const APP_CONTACT_PHONE = process.env.APP_CONTACT_PHONE || '(+63) 987 654 3210'; // For contact info
export const APP_ADDRESS =
  process.env.APP_ADDRESS ||
  'University Of The Philippines, Arts & Sciences Building, 3rd Floor, Gorordo Ave, Cebu City, 6000 Cebu'; // For contact info

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
  RESERVED = 'Reserved',
  RENTED = 'Rented',
  UNAVAILABLE = 'Unavailable',
}

export const ARTWORK_STATUSES = [
  ARTWORK_STATUS.AVAILABLE,
  ARTWORK_STATUS.RESERVED,
  ARTWORK_STATUS.RENTED,
  ARTWORK_STATUS.UNAVAILABLE,
];

export const CURRENCY_SYMBOL = '₱';

export const DELIVERY_FEE = 50;

export enum DELIVERY_METHOD {
  DELIVERY = 'Delivery',
  PICKUP = 'Pickup',
  NONE = 'None', // For extend rental duration where delivery method is N/A
}

export const DELIVERY_METHODS = [DELIVERY_METHOD.DELIVERY, DELIVERY_METHOD.PICKUP];

export const ERROR_MESSAGE = {
  GENERIC: 'An unexpected error occurred. Please try again later.',
  EMAIL_VERIFICATION_REQUIRED: 'Email verification is required. Please check your email for the verification link.',
  EMAIL_VERIFICATION_TOKEN_EXPIRED:
    'Your email verification token has expired. Please request a new verification email.',
  EMAIL_VERIFICATION_TOKEN_INVALID: 'The email verification token is invalid. Please check your verification link.',
  PASSWORD_RESET_TOKEN_EXPIRED: 'Your password reset token has expired. Please request a new password reset email.',
  PASSWORD_RESET_TOKEN_INVALID: 'The password reset token is invalid. Please check your password reset link.',
};

export enum EVENT_NAME {
  VISIT_SITE = 'visit_site',
  COOKIE_PREFERENCE = 'cookie_preference',
  BROWSE_ARTWORKS = 'browse_artworks',
  SEARCH_ARTWORKS = 'search_artworks',
  VIEW_ARTWORK = 'view_artwork',
  CREATE_ACCOUNT = 'create_account',
  VERIFY_EMAIL = 'verify_email',
  SET_ADDRESS = 'set_address',
  LOGIN = 'login',
  ADD_TO_CART = 'add_to_cart',
  ADD_TO_WISHLIST = 'add_to_wishlist',
  BEGIN_CHECKOUT = 'begin_checkout',
  SIGN_RENTAL_AGREEMENT = 'sign_rental_agreement',
  PLACE_ORDER = 'place_order',
  CANCEL_ORDER = 'cancel_order',
  ORDER_RECEIVED = 'order_received',
  REQUEST_RETURN_ITEMS = 'return_items',
  COMPLETE_PAYMENT = 'complete_payment',
  COMPLETE_ORDER = 'complete_order',
  CLEAR_SESSION = 'clear_session',
}

export enum EVENT_CATEGORY {
  DISCOVERY = 'discovery',
  ENGAGEMENT = 'engagement',
  INTEREST = 'interest',
  INTENT = 'intent',
  CONVERSION = 'conversion',
  SYSTEM = 'system',
}

export enum EVENT_ENTITY_TYPE {
  ARTWORK = 'artwork',
  RENTAL_ORDER = 'rental_order',
  PAYMENT = 'payment',
  USER = 'user',
}

export const DURATION_OPTIONS = [3, 6, 12];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export enum NOTIFICATION_TYPE {
  NEW_ORDER = 'New Order',
  ORDER_UPDATE = 'Order Update',
  SYSTEM_ALERT = 'System Alert',
}

/**
 * Order status flow and transitions
 *
 * @description Defines the lifecycle states of a rental order and their valid transitions:
 *
 * **Flow Diagram:**
 * - A. PENDING: New order, payment not yet received
 *   - → RESERVED (payment successful)
 *   - → CANCELLED (order cancelled)
 *
 * - B. RESERVED: Payment received, awaiting customer pickup/delivery
 *   - → TORECEIVE (rental period starts)
 *   - → CANCELLED (order cancelled before receipt)
 *
 * - C. TORECEIVE: Rental period active, awaiting customer to receive items
 *   - → ONGOING (customer receives items)
 *   - → CANCELLED (rental cancelled before receipt)
 *
 * - D. ONGOING: Customer has received items, rental in progress
 *   - → TORETURN (rental period ends or customer requests return)
 *   - → EXTENDED (customer extends rental duration)
 *
 * - E. EXTENDED: Rental duration extended, back to active rental state
 *   - → COMPLETED (items returned and confirmed)
 *   - → CANCELLED (extended rental cancelled)
 *
 * - F. TORETURN: Rental period ended, items awaiting return
 *   - → COMPLETED (items returned and confirmed)
 *
 * - G. COMPLETED: Order fulfilled, all items returned
 *   - (Terminal state)
 *
 * - H. CANCELLED: Order cancelled at any point
 *   - (Terminal state)
 *
 * @enum {string}
 */
export enum ORDER_STATUS {
  PENDING = 'Pending',
  RESERVED = 'Reserved',
  TORECEIVE = 'To Receive', // dynamic status
  ONGOING = 'Ongoing',
  TORETURN = 'To Return',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  EXTENDED = 'Extended',
}

export const ORDER_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.RESERVED,
  ORDER_STATUS.ONGOING,
  ORDER_STATUS.TORETURN,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.EXTENDED,
];

export enum PAYMENT_STATUS {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export const PAYMENT_STATUSES = [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED];

export enum PAYMENT_METHOD {
  CASH = 'Cash',
  ONLINE = 'Online',
}

export const PAYMENT_METHODS = [PAYMENT_METHOD.CASH, PAYMENT_METHOD.ONLINE];

export const PAYMENT_TRANSACTION_KEYS = {
  paymentIntentId: 'Stripe Payment Intent ID',
  browserSessionId: 'Browser Session ID',
  recordedBy: {
    id: 'ID',
    email: 'Email',
    fullName: 'Full Name',
  },
  notes: 'Notes',
};

export enum USER_ROLE {
  ADMIN = 'admin',
  HEAD = 'head',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum USER_STATUS {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  INACTIVE = 'Inactive',
}

export const USER_STATUSES = [USER_STATUS.ACTIVE, USER_STATUS.PENDING, USER_STATUS.INACTIVE];

export const ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.HEAD, USER_ROLE.STAFF];

export const ADMIN_EDITOR_ROLES = [USER_ROLE.ADMIN, USER_ROLE.STAFF];

export const USER_ROLES = [USER_ROLE.HEAD, USER_ROLE.STAFF, USER_ROLE.CUSTOMER];

export const SIMILAR_ARTWORK_SCORE_THRESHOLD = 0.5;
