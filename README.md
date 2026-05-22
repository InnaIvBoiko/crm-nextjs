# crm-nextjs

A CRM dashboard built with the Next.js App Router — company management with a
metrics dashboard, full company CRUD, and a self-contained mock backend.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **TanStack React Query 5** — server state / caching
- **Formik** — forms
- **Headless UI** — accessible UI primitives

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

| Variable                   | Default                 | Description                                                                       |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000` | Base URL of the API. Must be absolute — Server Components fetch it with full URLs. |

## Project structure

```
src/
├── app/                      # App Router
│   ├── (admin)/              # Admin route group (rendered dynamically)
│   │   ├── dashboard/        # Metrics dashboard — parallel slots:
│   │   │                     #   @stats @sales @categories @countries @promotions
│   │   └── companies/        # Company list, detail, create
│   │       └── @modal/(.)new # Intercepting route — "new company" as a modal
│   ├── api/v1/               # Route handlers (the mock backend)
│   └── components/           # Shared UI components
└── lib/
    ├── api.ts                # Typed fetch helpers + domain types
    ├── mock-data.ts          # In-memory data served by the route handlers
    └── utils/                # getQueryClient, getCountById
```

## API

The backend is mocked with in-memory data ([`src/lib/mock-data.ts`](src/lib/mock-data.ts))
served by Route Handlers under [`src/app/api/v1/`](src/app/api/v1). Data resets on
every server restart.

| Endpoint                  | Description                       |
| ------------------------- | --------------------------------- |
| `GET /api/v1/summary-stats/:id` | Dashboard summary counters  |
| `GET /api/v1/summary-sales`     | Per-company sales summary   |
| `GET /api/v1/countries`         | Country list                |
| `GET /api/v1/categories`        | Category list               |
| `GET /api/v1/companies`         | Company list                |
| `GET /api/v1/companies/:id`     | Single company              |
| `GET /api/v1/promotions`        | Promotion list              |

## Notes

- The `(admin)` section is marked `dynamic = 'force-dynamic'`: its Server
  Components fetch the app's own route handlers, so the pages render per-request
  rather than being statically prerendered at build time.
