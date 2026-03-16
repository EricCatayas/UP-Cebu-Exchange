## Setup

After cloning the git repository, run gitbash command:

```bash
npm run install
```

## Setup database:

Create .env.local file in root folder, set the following config values:

````env
```env
APP_BASE_URL=http://localhost:3000
APP_EMAIL=example@email.com
DB_HOST=localhost
DB_PORT=3306
DB_NAME=up_cebu_exchange
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql
NODE_ENV=development
JWT_SECRET=your-secret-jwt-key
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
MAILJET_API_KEY=mailjet-api-key
MAILJET_API_SECRET=mailjet-api-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=stripe-publishable-key
STRIPE_SECRET_KEY=stripe-secret-key
STRIPE_WEBHOOK_SECRET=stripe-webhook-signing-secret
CRON_SECRET=your_random_secret_key_here
# Optional config you can override
APP_CONTACT_EMAIL=contactus@email.com
APP_CONTACT_PHONE='(+63) 987 654 3210'
APP_ADDRESS='new address'
````

Create the database in MySQL

```sql
    DROP DATABASE IF EXISTS up_cebu_exchange;
    CREATE DATABASE up_cebu_exchange;
```

Initialize Database

```bash
npm run db:init
```

Reset Database

```bash
npm run db:reset
```

## Run the development server:

```bash
npm run dev
```

## Test Accounts:

customer: user1@test.com, password: user123
admin: admin@test.com, password: admin123

## Test Stripe Payment Local Development

Stripe is used for handling online payments in the app
Install Stripe CLI, then run command:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy webhook signing secret, set env variable STRIPE_WEBHOOK_SECRET

## Setup Cron Job

Add secret to .env:
CRON_SECRET=your_random_secret_key_here

Setup on Cron-job.org:

URL: https://your-app.vercel.app/api/webhooks/cron/notify-orders
Schedule: 0 8 \* \* \* (8:00 AM daily)
Method: POST
Headers: Authorization: Bearer {process.env.CRON_SECRET}

## Development Phase

Phase 1: Database & Authentication
Phase 2: Core Backend APIs
Phase 3: UI Foundation
Phase 4: Product Recommendation Engine
Phase 5: Analytics

project-root/
Route (app)
┌ ƒ /
├ ○ /\_not-found
├ ○ /about
├ ƒ /account/profile
├ ƒ /account/rentals
├ ƒ /account/rentals/[id]
├ ƒ /account/rentals/[id]/cancelled
├ ƒ /account/rentals/[id]/extend
├ ƒ /account/rentals/[id]/extend/rental-agreement
├ ƒ /account/rentals/[id]/extend/success
├ ƒ /account/rentals/[id]/payment
├ ƒ /account/rentals/[id]/payment/cancelled
├ ƒ /account/rentals/[id]/payment/success
├ ƒ /account/rentals/[id]/return/request
├ ƒ /account/wishlist
├ ƒ /admin
├ ○ /admin/artists
├ ƒ /admin/artists/[id]
├ ○ /admin/artists/create
├ ○ /admin/calendar
├ ƒ /admin/inventory
├ ƒ /admin/inventory/[id]
├ ƒ /admin/inventory/[id]/edit
├ ○ /admin/inventory/create
├ ƒ /admin/notifications
├ ○ /admin/orders
├ ƒ /admin/orders/[id]
├ ○ /admin/orders/create
├ ƒ /admin/payments
├ ƒ /admin/payments/[id]
├ ƒ /admin/payments/[id]/transactions/create
├ ƒ /admin/profile
├ ƒ /admin/reports
├ ○ /admin/themes
├ ○ /admin/users
├ ƒ /admin/users/[id]
├ ○ /admin/users/create
├ ƒ /api/address
├ ƒ /api/artists
├ ƒ /api/artists/[id]
├ ƒ /api/artworks
├ ƒ /api/artworks/[id]
├ ƒ /api/artworks/[id]/available-date
├ ƒ /api/artworks/[id]/image
├ ƒ /api/artworks/[id]/status
├ ƒ /api/auth/forgot-password
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/register
├ ƒ /api/auth/resend-verification
├ ƒ /api/auth/reset-password
├ ƒ /api/auth/session
├ ƒ /api/auth/verify-email
├ ƒ /api/cart
├ ƒ /api/checkout
├ ƒ /api/cookie-preference
├ ƒ /api/event/log
├ ƒ /api/notifications
├ ƒ /api/notifications/[id]
├ ƒ /api/notifications/[id]/read
├ ƒ /api/notifications/read-all
├ ƒ /api/payment/[id]
├ ƒ /api/payment/[id]/status
├ ƒ /api/payment/[id]/transaction
├ ƒ /api/rental-order
├ ƒ /api/rental-order/[id]
├ ƒ /api/rental-order/[id]/cancel
├ ƒ /api/rental-order/[id]/extend
├ ƒ /api/rental-order/[id]/fees
├ ƒ /api/rental-order/[id]/pay/stripe
├ ƒ /api/rental-order/[id]/return
├ ƒ /api/rental-order/[id]/status
├ ƒ /api/session
├ ƒ /api/session/clear
├ ƒ /api/session/end
├ ƒ /api/user
├ ƒ /api/user/[id]
├ ƒ /api/user/[id]/address
├ ƒ /api/user/[id]/profile
├ ƒ /api/webhooks/cron/notify-orders
├ ƒ /api/webhooks/stripe
├ ƒ /api/wishlist
├ ƒ /artists/[id]
├ ƒ /artworks
├ ƒ /artworks/[id]
├ ƒ /checkout
├ ƒ /checkout/address
├ ƒ /checkout/rental-agreement
├ ƒ /checkout/success/[id]
├ ○ /faq
├ ○ /forgot-password
├ ○ /icon.svg
├ ○ /login
├ ○ /privacy-policy
├ ○ /register
├ ƒ /reset-password
├ ○ /settings
├ ○ /team
├ ○ /terms-of-use
├ ƒ /verify-email
└ ƒ /verify-email/redirect

ƒ Proxy (Middleware)

○ (Static) prerendered as static content
ƒ (Dynamic) server-rendered on demand
