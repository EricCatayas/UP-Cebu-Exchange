# UP Cebu Exchange

Next.js ecommerce/rental platform for managing artworks, rentals, checkout, admin operations, notifications, and reporting.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- MySQL + Sequelize
- Stripe (payments)
- Cloudinary (image storage)
- Mailjet (email)

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+
- MySQL 8+
- Stripe account (for payment flows)
- Cloudinary account (for media uploads)
- Mailjet account (for email delivery)

## Quick Start (Local Development)

1. Install dependencies.

```bash
npm install
```

2. Create local environment file.

```bash
cp .env.example .env.local
```

If `cp` is not available on your shell (Windows), create `.env.local` manually using the template in the Environment Variables section below.

3. Create the database.

```sql
DROP DATABASE IF EXISTS up_cebu_exchange;
CREATE DATABASE up_cebu_exchange;
```

4. Initialize schema and seed data.

```bash
npm run db:init
```

5. Start the app.

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Environment Variables

The app uses different `.env` files depending on environment:

- Local development: `.env.local`
- Production runtime: environment variables configured in your hosting platform

### Local `.env.local` Template

```env
# Application
NODE_ENV=development
APP_BASE_URL=http://localhost:3000
APP_EMAIL=email.receiver@example.com
APP_CONTACT_EMAIL=contactus@email.com
APP_CONTACT_PHONE=(+63) 987 654 3210
APP_ADDRESS=Your full business address

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=up_cebu_exchange
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql

# Authentication
JWT_SECRET=replace-with-strong-random-string
NEXTAUTH_SECRET=replace-with-strong-random-string
NEXTAUTH_URL=http://localhost:3000

# Mailjet
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_API_SECRET=your_mailjet_api_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_FOLDER_NAME=up-cebu-exchange
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cron webhook auth
CRON_SECRET=replace-with-strong-random-string
```

### Production Variables Checklist

Set all variables above in your production host, with these required production-specific values:

- `NODE_ENV=production`
- `APP_BASE_URL=https://your-domain.com`
- `NEXTAUTH_URL=https://your-domain.com`
- Production database credentials (`DB_*`)
- Production Stripe keys (`pk_live_*`, `sk_live_*`) and live `STRIPE_WEBHOOK_SECRET`
- Strong secrets for `JWT_SECRET`, `NEXTAUTH_SECRET`, and `CRON_SECRET`

Security notes:

- Never commit `.env.local` or production secrets.
- Rotate leaked secrets immediately.
- Do not reuse test Stripe keys in production.

## Database Commands

- Initialize DB and seed data:

```bash
npm run db:init
```

- Reset DB (drops/recreates/seeds via script):

```bash
npm run db:reset
```

Seed files are in `src/scripts/seed/`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run db:init` - initialize DB and seed
- `npm run db:reset` - reset DB and reseed

## Local Integrations

### Stripe Webhook (Local)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret from Stripe CLI output and set `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### Mailjet

1. Create a Mailjet account.
2. Configure sender domain/DNS in Mailjet.
3. Set `MAILJET_API_KEY` and `MAILJET_API_SECRET`.

### Cron Job

Endpoint:

- `POST /api/webhooks/cron/notify-orders`

Auth header:

- `Authorization: Bearer <CRON_SECRET>`

Example schedule (daily at 8:00 AM):

- Cron expression: `0 8 * * *`

## Production Deployment Guide

This app can be deployed to any Node.js host (VPS, container, managed platforms).

1. Provision a production MySQL database.
2. Configure all production environment variables.
3. Build and run:

```bash
npm ci
npm run build
npm run start
```

4. Route HTTPS traffic to your app (reverse proxy/load balancer).
5. Configure Stripe webhook endpoint:

- `https://your-domain.com/api/webhooks/stripe`

6. Configure cron caller to trigger:

- `https://your-domain.com/api/webhooks/cron/notify-orders`

7. Verify critical flows:

- login/register
- checkout/payment
- email notifications
- admin dashboard pages

## Test Accounts (Seeded)

- Customer: `user1@test.com` / `user123`
- Admin: `admin@test.com` / `admin123`

Defined in `src/scripts/seed/users.ts`.

## Troubleshooting

- `ECONNREFUSED` to DB: verify `DB_HOST`, `DB_PORT`, MySQL service state, and DB user access.
- Auth/session issues: ensure `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `APP_BASE_URL` match runtime domain.
- Stripe webhook verification failed: check `STRIPE_WEBHOOK_SECRET` and endpoint URL.
- Missing images upload: verify all `CLOUDINARY_*` variables.

## License

Use according to your project/organization licensing policy.
