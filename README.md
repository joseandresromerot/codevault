# Codevault

A code snippet manager for developers. Save, organize, and share code snippets with syntax highlighting, collections, and a public explorer.

**Live:** https://codevault-neon.vercel.app

## Features

- GitHub OAuth authentication
- Create, edit, and delete snippets with syntax highlighting (CodeMirror)
- Organize snippets into collections
- Public explorer to browse snippets from all users
- Responsive UI, mobile-first

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS        |
| Backend  | Fastify, GraphQL (Mercurius + Pothos), Prisma   |
| Database | PostgreSQL (Neon)                               |
| Auth     | NextAuth v5, GitHub OAuth                       |
| Testing  | Vitest, React Testing Library, Playwright       |
| CI/CD    | GitHub Actions → Vercel (web) + Render (server) |

## Project Structure

```
codevault/
├── apps/
│   ├── web/       # Next.js frontend
│   └── server/    # Fastify + GraphQL backend
└── packages/
    └── types/     # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker (for local PostgreSQL)

### Setup

```bash
# Install dependencies
pnpm install

# Start the database
docker-compose up -d

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env

# Run migrations
cd apps/server && pnpm exec prisma migrate dev

# Start both apps
pnpm dev
```

The web app runs on http://localhost:3000 and the server on http://localhost:4000.

## Running Tests

```bash
# Unit tests (web)
pnpm --filter @codevault/web test

# Unit tests (server)
pnpm --filter @codevault/server test

# E2E tests
pnpm --filter @codevault/web test:e2e
```
