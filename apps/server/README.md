# Codevault — Server

Fastify + GraphQL API for Codevault. Built with Mercurius and Pothos, using Prisma as the ORM.

## Stack

- Fastify
- GraphQL (Mercurius + Pothos)
- Prisma ORM
- PostgreSQL
- Zod (input validation)
- TypeScript

## Getting Started

```bash
# From the monorepo root
pnpm install

# Or run only the server
pnpm --filter @codevault/server dev
```

### Environment Variables

Create `apps/server/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/codevault
JWT_SECRET=your_jwt_secret
WEB_URL=http://localhost:3000
PORT=4000
```

### Database

```bash
# Run migrations
pnpm --filter @codevault/server exec prisma migrate dev

# Open Prisma Studio
pnpm --filter @codevault/server exec prisma studio
```

## Testing

```bash
# Run all tests
pnpm --filter @codevault/server test

# Watch mode
pnpm --filter @codevault/server test:watch
```

## Project Structure

```
apps/server/
├── prisma/
│   └── schema.prisma     # Database schema
└── src/
    ├── graphql/          # GraphQL schema builder setup
    ├── lib/              # Prisma client, shared utilities
    ├── modules/          # Feature modules (snippets, collections, users)
    └── plugins/          # Fastify plugins (auth, cors)
```

## GraphQL Playground

Available at http://localhost:4000/graphql when running in development.
