# Codevault — Web

Next.js frontend for Codevault. Communicates with the GraphQL server via `urql`.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- urql (GraphQL client)
- CodeMirror 6 (syntax highlighting editor)
- NextAuth v5 (GitHub OAuth)
- shadcn/ui + @base-ui/react

## Getting Started

```bash
# From the monorepo root
pnpm install

# Or run only the web app
pnpm --filter @codevault/web dev
```

### Environment Variables

Create `apps/web/.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

AUTH_GITHUB_ID=your_github_oauth_app_id
AUTH_GITHUB_SECRET=your_github_oauth_app_secret

NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
DATABASE_URL=postgresql://user:password@localhost:5432/codevault
```

## Testing

```bash
# Unit tests
pnpm test

# Unit tests in watch mode
pnpm test:watch

# E2E tests (requires server running)
pnpm test:e2e
```

## Project Structure

```
apps/web/
├── app/           # Next.js App Router pages and layouts
├── components/    # React components
├── lib/           # GraphQL client, auth config, utilities
├── test/          # Unit tests (Vitest + React Testing Library)
└── e2e/           # End-to-end tests (Playwright)
```
