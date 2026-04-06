# Meyaar Jewelers - Monorepo Structure

## Project Organization

```
Meyaar-Jewelers/
├── frontend/              # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/         # Reusable components (StarRating, etc.)
│   │   │   ├── home/           # Home page sections
│   │   │   ├── product/        # Product-related components
│   │   │   ├── checkout/       # Checkout flow components
│   │   │   ├── auth/           # Authentication components
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React contexts (CartContext, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and services
│   │   └── assets/             # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/               # Express server & API
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Storage/database utilities
│   └── vite.ts            # Vite server config
│
├── shared/                # Shared types and utilities
│   └── schema.ts          # Shared database schemas
│
├── docs/                  # Documentation
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOY_DATABASE.md
│   ├── design_guidelines.md
│   └── ...
│
├── .env                   # Environment variables
├── package.json           # Root monorepo config
└── tsconfig.json          # Root TypeScript config
```

## Development

### Start Development Server
```bash
cd frontend
npm run dev
```
The server will start on `localhost:3000` and automatically:
- Run the Express backend
- Serve the React frontend with Vite hot-reload

### Build for Production
```bash
cd frontend
npm run build
npm run start
```

## Frontend Structure

### Components Organization
- **`shared/`** - Reusable components used across pages
  - `StarRating.tsx` - Display star ratings
  - `StarRatingSelector.tsx` - Interactive star selector
  - More shared utilities...

- **`home/`** - Home page specific sections
  - `Hero.tsx`
  - `PromoBar.tsx`
  - `Benefits.tsx`
  - `CategoryGrid.tsx`
  - etc.

- **`product/`** - Product detail page components
  - `ProductHeader.tsx`
  - `CustomerReviews.tsx`
  - `QuantitySelector.tsx`
  - etc.

- **`checkout/`** - Checkout flow components
  - `TaxSection.tsx`
  - `CartItemsList.tsx`
  - etc.

- **`ui/`** - shadcn/ui component library

### Import Pattern
```typescript
// ❌ Avoid nested imports
import Hero from "../../../components/Hero";

// ✅ Use index.ts for clean imports
import { Hero, PromoBar, Benefits } from "@/components/home";
```

## Backend Structure

- **`index.ts`** - Express server setup and middleware
- **`routes.ts`** - API route handlers
- **`storage.ts`** - Database and storage utilities
- **`vite.ts`** - Vite dev server integration

## Environment Variables

Create `.env.local` in the frontend directory:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
STRIPE_SECRET_KEY=...
GMAIL_APP_PASSWORD=...
```

## Dependencies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Wouter (routing)
- TanStack Query

### Backend
- Express
- TypeScript
- Nodemailer
- Stripe SDK

## Version
- Node.js: 18+
- npm: 9+
