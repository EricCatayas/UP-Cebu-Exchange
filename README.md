## Setup

After cloning the git repository, run gitbash command:

```bash
npm run install
```

## Setup database:

Create .env.local file in root folder, set the following config values:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=up_cebu_exchange
DB_USERNAME=root
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql
```

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

Phase 1: Database & Authentication
Phase 2: Core Backend APIs
Phase 3: UI Foundation
Phase 4: Product Recommendation Engine
Phase 5: Analytics

project-root/
│
├── app/ # Next.js App Router base
│ │
│ ├── (customer)/ # CUSTOMER-facing routes
│ │ ├── layout.tsx # Layout for customer-facing pages
│ │ ├── page.tsx # Home page
│ │ │
│ │ ├── artworks/
│ │ │ ├── page.tsx # All Artworks
│ │ │ └── [id]/page.tsx # Artwork Details
│ │ │
│ │ ├── about/
│ │ │ └── page.tsx # About Us
│ │ │
│ │ ├── privacy-policy/
│ │ │ └── page.tsx # Privacy Policy
│ │ │
│ │ ├── terms-and-conditions/
│ │ │ └── page.tsx # Terms and Conditions
│ │ │
│ │ ├── account/
│ │ │ ├── layout.tsx # Account layout (sidebar, etc.)
│ │ │ ├── profile/page.tsx # Profile
│ │ │ ├── wishlist/page.tsx # My Wishlist
│ │ │ ├── rentals/page.tsx # My Rentals
│ │ │
│ │ ├── login/page.tsx # Login
│ │ ├── register/page.tsx # Register
│ │ ├── forgot-password/page.tsx# Forgot Password
│ │ ├── reset-password/page.tsx # Reset Password
│ │ └── verify-email/page.tsx # Verify Email
│ │ │
│ │ ├── checkout/
│ │ │ ├── page.tsx # Checkout
│ │ │ ├── rental-agreement/page.tsx # Rental Agreement
│ │ │ └── success/page.tsx # Checkout Successful
│ │
│ ├── (admin)/ # ADMIN panel routes
│ │ ├── layout.tsx # Admin layout (sidebar, navbar, etc.)
│ │ ├── dashboard/page.tsx # Dashboard
│ │ │
│ │ ├── orders/
│ │ │ ├── page.tsx # Orders list
│ │ │ ├── create/page.tsx # Create Order
│ │ │ └── [id]/edit/page.tsx # Update Order
│ │ │
│ │ ├── inventory/
│ │ │ ├── page.tsx # Inventory list
│ │ │ ├── create/page.tsx # Create Product
│ │ │ └── [id]/edit/page.tsx # Update Product
│ │ │
│ │ ├── users/
│ │ │ ├── page.tsx # Users list
│ │ │ ├── create/page.tsx # Create User
│ │ │ └── [id]/edit/page.tsx # Update User
│ │ │
│ │ ├── notifications/page.tsx # Notifications
│ │ ├── themes/page.tsx # Themes
│ │ └── reports/page.tsx # Reports
│ │
│ ├── api/ # Next.js Route Handlers (API endpoints)
│ │ ├── auth/
│ │ │ ├── login/route.ts
│ │ │ ├── register/route.ts
│ │ │ ├── forgot-password/route.ts
│ │ │ ├── reset-password/route.ts
│ │ │ └── verify-email/route.ts
│ │ ├── artworks/route.ts
│ │ ├── rentals/route.ts
│ │ ├── wishlist/route.ts
│ │ ├── orders/route.ts
│ │ └── payments/route.ts
│
├── components/ # Shared UI components
│
├── lib/ # Utility logic
│
├── store/ # State management
│
├── public/ # Static assets
│ ├── images/
│ ├── icons/
│ └── uploads/
│
├── middleware.ts # Middleware (auth checks, redirects)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
