# crm-nextjs

[![CI](https://github.com/InnaIvBoiko/crm-nextjs/actions/workflows/ci.yml/badge.svg)](https://github.com/InnaIvBoiko/crm-nextjs/actions/workflows/ci.yml)

A CRM dashboard built with the Next.js App Router — a public landing page, mock
authentication, a metrics dashboard, and full CRUD for companies and promotions
backed by a Postgres database.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Postgres** (Neon serverless) + **Drizzle ORM** — typed schema, migrations, queries
- **TanStack React Query 5** — server state / caching
- **Formik** — forms
- **Headless UI** — accessible UI primitives (modals, accordion)
- **Vitest** + React Testing Library — unit tests

## Features

- **Landing page** (`/`) — public page with a hero, feature cards and a FAQ
- **Authentication** — mock login / registration; the header shows the signed-in
  user or a "Guest" state (see [Authentication](#authentication))
- **Dashboard** (`/dashboard`) — metrics assembled from parallel route slots
- **Companies** — list, detail, create, edit and delete
- **Promotions** — create, edit and delete promotions per company
- **Image upload** — company logos and promotion images (stored as data URLs)
- Create / edit forms open as modals via intercepting routes, with full-page
  fallbacks for direct navigation or refresh

## Requirements

- Node.js **20.9** or later
- npm
- A Postgres database (a free [Neon](https://neon.tech) project works out of the box)

## Getting started

```bash
npm install

# 1. Configure env
cp .env.example .env.local
# then edit .env.local and set DATABASE_URL to your Postgres connection string

# 2. Create the tables and seed sample data
npm run db:migrate
npm run db:seed

# 3. Run the app
npm run dev
```

The app runs at <http://localhost:3000>.

### Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the dev server                         |
| `npm run build` | Production build                             |
| `npm run start` | Serve the production build (run build first) |
| `npm run lint`  | Run ESLint                                   |
| `npm run typecheck` | Type-check with `tsc --noEmit`           |
| `npm test`      | Run the Vitest suite once                    |
| `npm run test:watch` | Run Vitest in watch mode                |
| `npm run db:generate` | Generate a SQL migration from the schema |
| `npm run db:migrate` | Apply pending migrations to the database  |
| `npm run db:seed`   | Seed the database with sample data         |
| `npm run db:studio` | Open Drizzle Studio (browse the data)      |

## Environment

Configuration lives in `.env.local` (see [`.env.example`](.env.example)):

| Variable                   | Default                 | Description                                                                                                                     |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000` | Absolute base URL of the API. Server Components fetch the route handlers with full URLs, so this must point at the running app. |
| `DATABASE_URL`             | —                       | Postgres connection string used by Drizzle in the route handlers. **Required.**                                               |

When deploying, set both on the host — see [Deployment](#deployment).

## Project structure

```
src/
├── app/                          # App Router
│   ├── page.tsx                  # Public landing page (static)
│   ├── (admin)/                  # Admin route group (rendered dynamically)
│   │   ├── dashboard/            # Metrics dashboard — parallel slots:
│   │   │                         #   @stats @sales @categories @countries @promotions
│   │   └── companies/            # Company list / detail / create / edit
│   │       ├── @header @toolbar @modal           # Parallel slots
│   │       ├── new/                              # Create company
│   │       └── [id]/
│   │           ├── edit/                         # Edit company
│   │           ├── new-promotion/                # Create promotion
│   │           └── edit-promotion/[promotionId]/ # Edit promotion
│   ├── api/v1/                   # Route handlers (the HTTP API over the DB)
│   └── components/               # Shared UI components
└── lib/
    ├── api.ts                    # Typed fetch helpers + domain types
    ├── db/                       # Database layer (Drizzle)
    │   ├── schema.ts             # Tables + enums
    │   ├── index.ts              # Neon-backed Drizzle client
    │   ├── queries.ts            # Data-access functions used by the route handlers
    │   └── seed.ts               # Seed script (npm run db:seed)
    ├── mock-data.ts              # Sample data — source for the seed script
    └── utils/                    # getQueryClient, getCountById
```

Create / edit screens have both a real route (e.g. `/companies/[id]/edit`) and an
intercepting route inside `@modal`: soft navigation shows a modal, while a direct
hit or a refresh renders the full page.

## Database

Data lives in Postgres, accessed through [Drizzle ORM](https://orm.drizzle.team).
The schema ([`src/lib/db/schema.ts`](src/lib/db/schema.ts)) is normalized —
companies reference countries and categories by id, and promotions/sales
reference companies — while the API returns denormalized shapes (titles resolved
via joins, `hasPromotions` derived), so the frontend contract is unchanged.

- **Migrations** live in [`drizzle/`](drizzle) and are generated from the schema
  with `npm run db:generate`, then applied with `npm run db:migrate`.
- **Seed data** comes from [`src/lib/mock-data.ts`](src/lib/mock-data.ts) via
  `npm run db:seed`.
- The data-access functions in [`src/lib/db/queries.ts`](src/lib/db/queries.ts)
  keep the route handlers thin.

## API

Route handlers under [`src/app/api/v1/`](src/app/api/v1) expose the database over
HTTP. They are marked `dynamic = 'force-dynamic'` so every request reads fresh
from Postgres.

| Endpoint                           | Description                                   |
| ---------------------------------- | --------------------------------------------- |
| `GET    /api/v1/summary-stats/:id` | Dashboard summary counters                    |
| `GET    /api/v1/summary-sales`     | Per-company sales summary                     |
| `GET    /api/v1/countries`         | Country list                                  |
| `GET    /api/v1/categories`        | Category list                                 |
| `GET    /api/v1/companies`         | Company list                                  |
| `POST   /api/v1/companies`         | Create a company                              |
| `GET    /api/v1/companies/:id`     | Single company                                |
| `PUT    /api/v1/companies/:id`     | Update a company                              |
| `DELETE /api/v1/companies/:id`     | Delete a company (cascades to its promotions) |
| `GET    /api/v1/promotions`        | Promotion list (filter with `?companyId=`)    |
| `POST   /api/v1/promotions`        | Create a promotion                            |
| `GET    /api/v1/promotions/:id`    | Single promotion                              |
| `PUT    /api/v1/promotions/:id`    | Update a promotion                            |
| `DELETE /api/v1/promotions/:id`    | Delete a promotion                            |

## Authentication

Authentication is a **client-side mock for demo purposes** — it is not real
security. Any credentials are accepted, the session is kept in `localStorage`,
and there is no server-side verification or route protection. Do not treat the
signed-in state as a security boundary.

## Deployment

The app builds with `npm run build` and can be deployed to any Next.js host
(e.g. Vercel). Before deploying:

- Set `NEXT_PUBLIC_API_BASE_URL` to the deployment's public URL (e.g.
  `https://your-app.vercel.app`). Otherwise Server Components fetch
  `http://localhost:3000` and the data pages fail. `NEXT_PUBLIC_*` variables are
  inlined at build time, so **redeploy** after changing it.
- Set `DATABASE_URL` to your Postgres connection string (on Vercel: Project →
  Settings → Environment Variables). Run `npm run db:migrate` and `npm run db:seed`
  against that database once before the first deploy.

## Notes

- The `(admin)` section is marked `dynamic = 'force-dynamic'`: its Server
  Components fetch the app's own route handlers, so the pages render per-request
  rather than being statically prerendered at build time.
