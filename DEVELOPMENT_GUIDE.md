# Development Guide

Complete guide for developers working on the Maritime Crew Management System.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Project Structure](#project-structure)
4. [Code Style](#code-style)
5. [Git Workflow](#git-workflow)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Common Tasks](#common-tasks)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **PostgreSQL**: Database instance (Neon recommended)
- **Python**: 3.9+ (for backend)
- **Git**: Version control

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maritime-crew-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up database**
   ```bash
   # Generate Prisma Client
   pnpm --filter database prisma generate
   
   # Run migrations
   pnpm --filter database prisma migrate dev
   
   # Seed database (optional)
   pnpm --filter database prisma db seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## Development Environment

### IDE Setup

**Recommended**: VS Code with extensions:
- ESLint
- Prettier
- Prisma
- TypeScript
- Tailwind CSS IntelliSense

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Environment Variables

**Frontend** (`.env.local`):
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=...
PORT=8000
```

---

## Project Structure

### Monorepo Organization

```
maritime-crew-system/
├── apps/
│   └── web/              # Next.js frontend
├── packages/
│   ├── database/         # Prisma schema
│   └── ui/              # Shared UI components
├── backend/             # Python FastAPI backend
└── demo/                # Demo scripts
```

### Workspace Packages

- `@maritime-crew-system/web`: Frontend application
- `@maritime-crew-system/database`: Database package
- `@maritime-crew-system/ui`: UI components package

### Turborepo Tasks

- `dev`: Start development servers
- `build`: Build all packages
- `lint`: Lint all packages
- `type-check`: Type check all packages
- `format`: Format code with Prettier

---

## Code Style

### TypeScript

- **Strict mode**: Enabled
- **Type safety**: All functions typed
- **No `any`**: Use `unknown` or proper types
- **Interfaces**: Prefer interfaces over types for objects

**Example**:
```typescript
interface User {
  id: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // Implementation
}
```

### React Components

- **Functional components**: Use function components
- **Hooks**: Use hooks for state and effects
- **Props**: Define prop types with interfaces
- **Client components**: Mark with `"use client"` when needed

**Example**:
```typescript
"use client";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### File Naming

- **Components**: PascalCase (e.g., `CertificateCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CONSTANTS.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `certificate.types.ts`)

### Import Organization

```typescript
// 1. External libraries
import React from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Internal packages
import { prisma } from "@maritime-crew-system/database";

// 3. Relative imports
import { CertificateCard } from "./CertificateCard";
import { formatDate } from "../utils/formatDate";
```

### Comments

- **JSDoc**: Use JSDoc for public functions
- **Inline comments**: Explain "why", not "what"
- **TODO comments**: Mark with `TODO:` prefix

**Example**:
```typescript
/**
 * Finds optimal crew members for a vessel position.
 * 
 * @param request - Assignment request with vessel and requirements
 * @returns Array of candidate crew members sorted by score
 */
async function findOptimalCrew(request: AssignmentRequest): Promise<Candidate[]> {
  // Implementation
}
```

---

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches
- `docs/*`: Documentation branches

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

**Examples**:
```
feat(certificates): add certificate expiry alerts

fix(auth): resolve session expiration issue

docs(api): update API documentation
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch and create PR
4. Request review
5. Address feedback
6. Merge after approval

---

## Testing

### Frontend Testing

**Unit Tests** (to be implemented):
```bash
pnpm test
```

**Component Tests**:
```typescript
import { render, screen } from "@testing-library/react";
import { CertificateCard } from "./CertificateCard";

describe("CertificateCard", () => {
  it("renders certificate information", () => {
    const certificate = { /* mock data */ };
    render(<CertificateCard certificate={certificate} />);
    expect(screen.getByText(certificate.certificateType.name)).toBeInTheDocument();
  });
});
```

### Backend Testing

**Run tests**:
```bash
cd backend
pytest tests/
```

**Test structure**:
```python
def test_crew_member_creation():
    # Arrange
    crew_data = {...}
    
    # Act
    result = create_crew_member(crew_data)
    
    # Assert
    assert result.id is not None
    assert result.employee_id == crew_data["employee_id"]
```

### E2E Testing

**Playwright** (to be implemented):
```bash
pnpm test:e2e
```

---

## Debugging

### Frontend Debugging

**Next.js Debugging**:
- Use browser DevTools
- React DevTools extension
- Next.js error overlay

**Debug API Routes**:
```typescript
// Add console.log for debugging
console.log("Request data:", request);

// Use VS Code debugger
// Set breakpoints in API route files
```

**Prisma Debugging**:
```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Backend Debugging

**FastAPI Debugging**:
- Use VS Code Python debugger
- Add breakpoints in route handlers
- Check FastAPI logs

**Database Debugging**:
- Use Prisma Studio: `pnpm --filter database prisma studio`
- Check SQL logs in database

### Common Debugging Scenarios

**Database Connection Issues**:
```bash
# Test connection
pnpm --filter database prisma db pull

# Check migrations
pnpm --filter database prisma migrate status
```

**Type Errors**:
```bash
# Type check
pnpm type-check

# Check specific file
npx tsc --noEmit apps/web/src/path/to/file.ts
```

---

## Common Tasks

### Adding a New Page

1. **Create page file**:
   ```typescript
   // apps/web/src/app/(dashboard)/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. **Add route to sidebar**:
   ```typescript
   // apps/web/src/components/layout/Sidebar.tsx
   <Link href="/new-page">New Page</Link>
   ```

3. **Add page title**:
   ```typescript
   // apps/web/src/components/layout/Header.tsx
   const pageTitles = {
     "/new-page": "New Page",
   };
   ```

### Adding a New API Route

1. **Create route file**:
   ```typescript
   // apps/web/src/app/api/new-endpoint/route.ts
   import { NextRequest, NextResponse } from "next/server";
   
   export async function GET(request: NextRequest) {
     return NextResponse.json({ success: true });
   }
   ```

2. **Add authentication** (if needed):
   ```typescript
   import { getServerSession } from "next-auth";
   import { authOptions } from "@/lib/auth/options";
   
   export async function GET(request: NextRequest) {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
     // ...
   }
   ```

### Adding a New Database Model

1. **Update Prisma schema**:
   ```prisma
   // packages/database/prisma/schema.prisma
   model NewModel {
     id        String   @id @default(cuid())
     name      String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Create migration**:
   ```bash
   pnpm --filter database prisma migrate dev --name add_new_model
   ```

3. **Generate Prisma Client**:
   ```bash
   pnpm --filter database prisma generate
   ```

### Adding a New Component

1. **Create component file**:
   ```typescript
   // apps/web/src/components/new/NewComponent.tsx
   interface NewComponentProps {
     // props
   }
   
   export function NewComponent({ ... }: NewComponentProps) {
     return <div>Component</div>;
   }
   ```

2. **Export from index** (if in package):
   ```typescript
   // packages/ui/index.ts
   export { NewComponent } from "./NewComponent";
   ```

### Adding a New Agent

1. **Create agent class**:
   ```typescript
   // apps/web/src/lib/agents/new-agent.ts
   import { BaseAgent } from "./base-agent";
   import { AgentType } from "./types";
   
   export class NewAgent extends BaseAgent {
     constructor() {
       super("new_agent_001", AgentType.NEW_AGENT, "NewAgent");
     }
     
     protected async handleMessage(payload: any): Promise<any> {
       // Implementation
     }
   }
   ```

2. **Register in orchestrator**:
   ```typescript
   // apps/web/src/lib/agents/orchestrator.ts
   import { NewAgent } from "./new-agent";
   
   constructor() {
     this.agents.set(AgentType.NEW_AGENT, new NewAgent());
   }
   ```

3. **Create API endpoint**:
   ```typescript
   // apps/web/src/app/api/agents/new-agent/route.ts
   ```

---

## Best Practices

### Performance

- **Code splitting**: Use dynamic imports for large components
- **Image optimization**: Use Next.js `Image` component
- **Query optimization**: Use React Query caching
- **Database queries**: Use Prisma select to limit fields

### Security

- **Authentication**: Always check session in API routes
- **Input validation**: Use Zod for validation
- **SQL injection**: Use Prisma (parameterized queries)
- **XSS prevention**: React escapes by default

### Error Handling

- **Try-catch**: Wrap async operations
- **Error boundaries**: Use React error boundaries
- **User-friendly messages**: Don't expose internal errors
- **Logging**: Log errors for debugging

### Code Organization

- **Separation of concerns**: Separate logic from UI
- **Reusability**: Extract common logic to utilities
- **Type safety**: Use TypeScript strictly
- **Documentation**: Document complex logic

---

## Troubleshooting

### Common Issues

#### Database Connection Failed

**Symptoms**: Prisma connection errors

**Solutions**:
- Check `DATABASE_URL` is correct
- Verify database is accessible
- Check SSL settings match provider
- Test connection: `pnpm --filter database prisma db pull`

#### Prisma Client Not Generated

**Symptoms**: `PrismaClient is not defined`

**Solutions**:
```bash
pnpm --filter database prisma generate
```

#### Type Errors After Schema Change

**Symptoms**: TypeScript errors after Prisma migration

**Solutions**:
```bash
# Regenerate Prisma Client
pnpm --filter database prisma generate

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### Build Fails

**Symptoms**: Build errors in CI/CD

**Solutions**:
- Check environment variables are set
- Verify all dependencies are installed
- Check TypeScript errors: `pnpm type-check`
- Clear cache: `pnpm turbo clean`

#### Port Already in Use

**Symptoms**: `Port 3000 is already in use`

**Solutions**:
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Check error logs
4. Ask team members
5. Create issue with details

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: November 2025
