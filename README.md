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

## Railway Deployment

This project is configured for deployment on Railway. Follow these steps:

### Prerequisites

1. A Railway account ([railway.app](https://railway.app))
2. A PostgreSQL database (Railway PostgreSQL service or external like Neon)

### Deployment Steps

1. **Create a new Railway project** and connect your repository

2. **Add a PostgreSQL service** (or use an external database):
   - If using Railway PostgreSQL, the `DATABASE_URL` will be automatically set
   - If using external database (e.g., Neon), add `DATABASE_URL` as an environment variable

3. **Set environment variables** in Railway:
   - `DATABASE_URL` - PostgreSQL connection string (auto-set if using Railway PostgreSQL)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Railway app URL (e.g., `https://your-app-name.up.railway.app`)
   - `PORT` - Automatically set by Railway (no need to configure)

4. **Configure the service**:
   - Root directory: `/` (default)
   - Build command: `pnpm install && pnpm build` (configured in `railway.json`)
   - Start command: `cd apps/web && pnpm start` (configured in `railway.json`)

5. **Run database migrations** (one-time setup):
   - After first deployment, run migrations via Railway CLI or add a one-time script:
     ```bash
     railway run pnpm --filter @maritime-crew-system/database db:push
     ```
   - Or use Railway's console to run:
     ```bash
     cd packages/database && pnpm db:push
     ```

6. **Seed the database** (optional):
   ```bash
   railway run pnpm --filter @maritime-crew-system/database db:seed
   ```

### Important Notes

- Prisma Client is automatically generated during `pnpm install` via the `postinstall` script
- The build process ensures all workspace dependencies are built in the correct order
- Next.js is configured with `output: 'standalone'` for optimal Railway deployment
- Railway automatically handles the `PORT` environment variable

### Troubleshooting

- **Build fails**: Ensure `DATABASE_URL` is set correctly
- **Prisma errors**: Verify Prisma Client was generated (check build logs)
- **App won't start**: Check that `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
- **Database connection errors**: Verify `DATABASE_URL` format and SSL settings

## Documentation

Comprehensive documentation is available in the following files:

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete system documentation
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference guide
- **[COMPONENTS.md](./COMPONENTS.md)** - React components documentation
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database schema reference
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Developer guide
- **[AGENT_SYSTEM.md](./AGENT_SYSTEM.md)** - AI agent system documentation
- **[QUICK_START_AGENTS.md](./QUICK_START_AGENTS.md)** - Quick start guide for agents
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation status
- **[CREW_PAY_SYSTEM.md](./CREW_PAY_SYSTEM.md)** - Crew pay system documentation

### Quick Links

- **Getting Started**: See [DOCUMENTATION.md](./DOCUMENTATION.md#setup--installation)
- **API Reference**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Component Guide**: See [COMPONENTS.md](./COMPONENTS.md)
- **Database Schema**: See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Development Setup**: See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

## License

Private - All rights reserved
