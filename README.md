# Maritime Crew Management System

A comprehensive crew and certificate management system for maritime operations built with Next.js 14, TypeScript, Prisma, and Neon PostgreSQL.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **State Management**: React Query (TanStack Query)
- **Package Manager**: pnpm
- **Monorepo**: Turborepo

## Project Structure

```
maritime-crew-system/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── database/         # Prisma schema and migrations
│   └── ui/              # Shared UI components
├── package.json          # Root package
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── turbo.json           # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your Neon database connection string

5. Generate Prisma Client:
   ```bash
   pnpm --filter database prisma generate
   ```

6. Run database migrations:
   ```bash
   pnpm --filter database prisma migrate dev
   ```

7. Seed the database (optional):
   ```bash
   pnpm --filter database prisma db seed
   ```

8. Start the development server:
   ```bash
   pnpm dev
   ```

9. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

### Running Commands

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier

### Database Commands

- `pnpm --filter database db:migrate` - Run migrations
- `pnpm --filter database db:generate` - Generate Prisma Client
- `pnpm --filter database db:studio` - Open Prisma Studio
- `pnpm --filter database db:seed` - Seed database

## Theme

The application uses a maritime blue color scheme:
- **Primary**: #1E3A8A (Maritime Blue)
- **Secondary**: #0D9488 (Teal)

## License

Private - All rights reserved
