## Event Manager (Fastbreak Event Dashboard)

### Stack (expectations)

- **Next.js 16** (App Router)
- **React 19 + TypeScript**
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`)
- **TailwindCSS + shadcn/ui**
- **Server-first data access**
  - **Reads**: Server Components (driven by `searchParams`)
  - **Writes**: Server Actions (no internal CRUD `/api` routes)

### Security model (RLS-first)

Database access is protected primarily by **Supabase Postgres RLS**:

- **Authenticated users can read their own events and venues**
- **Only the event owner can create/update/delete their events**
- **Only the event owner can create/update/delete venues for their events**

See `database/schema.sql` for the RLS policies.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables

#### Local Development

Create a `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For Playwright e2e tests, also add:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

**Note**: `SUPABASE_SERVICE_ROLE_KEY` is required for test user management. Never commit this key to version control.

#### Vercel Deployment

When deploying to Vercel, configure these environment variables in your project settings:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

**For e2e tests (if running in CI):**
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (add as a secret)
- `PLAYWRIGHT_TEST_BASE_URL` - Your production or preview URL

### Repo conventions (stack-aligned)

- **Auth gating**: handled in `app/(protected)/layout.tsx` via server redirect (no client auth gates).
- **Supabase client**:
  - server: `lib/supabase/server.ts` (cookie-scoped SSR client)
- **Mutations**: `lib/actions/*` (Server Actions) + `revalidatePath` / `redirect`

### Architecture & folder structure

- **Routes**: `app/*`
  - Public routes (e.g. `app/login`)
  - Protected routes under `app/(protected)/*` (auth enforced once in `app/(protected)/layout.tsx`)
- **UI components**:
  - `components/ui/*` – shadcn-style primitives (button, card, dialog, form, inputs, table, etc.)
  - `components/features/*` – feature-level components (auth, dashboard, events) composed from primitives
- **Domain logic & data access**:
  - `lib/actions/*` – Server Actions plus `ActionResult` helpers (mutations only)
  - `lib/queries/*` – server read queries returning `QueryResult`
  - `lib/services/*` – non-UI services (auth helpers, repositories, realtime, form orchestration)
  - `lib/validation/*` – Zod schemas and domain types shared by server and client
  - `lib/forms/*` – mapping between domain input types and React Hook Form values, plus error-path mapping
  - `lib/supabase/*` – Supabase client factories (`createClient` for server, `getBrowserClient` for realtime)
  - `lib/utils/*` – shared utilities (dates, logger, etc.)
- **Naming conventions**:
  - Actions: `createEventAction`, `updateEventAction`, `signInAction`
  - Queries: `getEventsForDashboard`, `getEventForEdit`
  - Types: `EventActionInput`, `EventFormValues`, `EventWithVenues`, `ActionResult<T>`, `QueryResult<T>`

### Common tasks

- **Dev**: `npm run dev`
- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck`
- **Test**: `npm test` (Playwright e2e tests)
- **Test UI**: `npm run test:ui` (Playwright test UI)
- **Build**: `npm run build`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the environment variables (see above)
4. Deploy

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
