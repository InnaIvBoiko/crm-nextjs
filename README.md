# crm-nextjs

A CRM dashboard built with the Next.js App Router — a public landing page, mock
authentication, a metrics dashboard, and full CRUD for companies and promotions
on a self-contained in-memory backend.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **TanStack React Query 5** — server state / caching
- **Formik** — forms
- **Headless UI** — accessible UI primitives (modals, accordion)

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

## Getting started

```bash
npm install
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

## Environment

Configuration lives in `.env.local`:

| Variable                   | Default                 | Description                                                                                                                     |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000` | Absolute base URL of the API. Server Components fetch the route handlers with full URLs, so this must point at the running app. |

When deploying, set this to the deployment's public URL — see [Deployment](#deployment).

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
│   ├── api/v1/                   # Route handlers (the mock backend)
│   └── components/               # Shared UI components
└── lib/
    ├── api.ts                    # Typed fetch helpers + domain types
    ├── mock-data.ts              # In-memory data served by the route handlers
    └── utils/                    # getQueryClient, getCountById
```

Create / edit screens have both a real route (e.g. `/companies/[id]/edit`) and an
intercepting route inside `@modal`: soft navigation shows a modal, while a direct
hit or a refresh renders the full page.

## API

The backend is mocked with in-memory data ([`src/lib/mock-data.ts`](src/lib/mock-data.ts))
served by Route Handlers under [`src/app/api/v1/`](src/app/api/v1). **Data is held
in memory and resets on every server restart** (and is not shared across
serverless instances — see [Deployment](#deployment)).

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
- The backend is **in-memory**: on serverless platforms data does not persist
  and is inconsistent across instances. A real database is required for
  production use.

## Notes

- The `(admin)` section is marked `dynamic = 'force-dynamic'`: its Server
  Components fetch the app's own route handlers, so the pages render per-request
  rather than being statically prerendered at build time.
