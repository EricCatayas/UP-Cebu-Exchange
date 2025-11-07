## Setup

After cloning the git repository, run gitbash command:
```bash
npm run install
```
## Setup database:
Update your .env.local with your actual MySQL credentials:
```bash
DB_PASSWORD=your_mysql_password
```
Create the database in MySQL
```sql
CREATE DATABASE up_cebu_exchange;
```
Initialize Database
```bash
npm run db:init
```
## Run the development server:
```bash
npm run dev
```
Phase 1: Database & Authentication
Phase 2: Core Backend APIs
Phase 3: UI Foundation

project-root/
│
├── app/ # Next.js App Router base
│ │
│ ├── (customer)/ # CUSTOMER-facing routes
│ │ ├── layout.tsx # Layout for customer-facing pages
│ │ ├── page.tsx # Home page (optional)
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
│ │ ├── auth/
│ │ │ ├── login/page.tsx # Login
│ │ │ ├── register/page.tsx # Register
│ │ │ ├── forgot-password/page.tsx# Forgot Password
│ │ │ ├── reset-password/page.tsx # Reset Password
│ │ │ └── verify-email/page.tsx # Verify Email
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
│ ├── ui/ # Buttons, modals, inputs, etc.
│ ├── layouts/ # Shared layouts for customer/admin
│ ├── cards/ # Artwork cards, product cards
│ ├── tables/ # Data tables for admin
│ ├── forms/ # Form components (input groups, validators)
│ ├── navigation/ # Navbars, sidebars, breadcrumbs
│ └── feedback/ # Toasts, alerts, notifications
│
├── lib/ # Utility logic
│ ├── api.ts # Fetch wrapper for API calls
│ ├── auth.ts # Auth helpers (JWT, session, etc.)
│ ├── validation.ts # Zod/Yup schemas
│ ├── helpers.ts # Misc helpers (formatPrice, etc.)
│ ├── recommendation.ts # Recommendation Engine logic
│ └── constants.ts # Static constants
│
├── hooks/ # Reusable React hooks
│ ├── useAuth.ts
│ ├── useFetch.ts
│ ├── useWishlist.ts
│ └── useRecommendation.ts
│
├── store/ # State management (Zustand/Redux)
│ ├── userStore.ts
│ ├── wishlistStore.ts
│ ├── rentalStore.ts
│ └── themeStore.ts
│
├── types/ # TypeScript interfaces
│ ├── rental.ts
│ ├── artwork.ts
│ ├── user.ts
│ ├── payment.ts
│ ├── recommendation.ts
│ └── index.ts
│
├── styles/ # Global and module styles
│ ├── globals.css
│ └── tailwind.css
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
