# Components Documentation

Complete documentation for all React components in the Maritime Crew Management System.

## Table of Contents

1. [Component Structure](#component-structure)
2. [Certificate Components](#certificate-components)
3. [Layout Components](#layout-components)
4. [UI Components](#ui-components)
5. [Component Patterns](#component-patterns)

---

## Component Structure

Components are organized in `apps/web/src/components/`:

```
components/
├── certificates/      # Certificate-specific components
├── layout/           # Layout components (Header, Sidebar)
└── ui/               # Reusable UI primitives (shadcn/ui)
```

---

## Certificate Components

### CertificateCard

**Location**: `components/certificates/CertificateCard.tsx`

**Description**: Displays certificate information in a card format

**Props**:
```typescript
interface CertificateCardProps {
  certificate: CrewCertificate;
  onView?: (certificate: CrewCertificate) => void;
}
```

**Features**:
- Certificate type and code display
- Status badge with expiry date
- Crew member information
- Issue and expiry dates
- Optional view details button

**Usage**:
```tsx
<CertificateCard 
  certificate={certificate} 
  onView={(cert) => handleView(cert)} 
/>
```

---

### CertificateTable

**Location**: `components/certificates/CertificateTable.tsx`

**Description**: Tabular display of certificates with sorting and filtering

**Props**:
```typescript
interface CertificateTableProps {
  certificates: CrewCertificate[];
  onEdit?: (certificate: CrewCertificate) => void;
  onDelete?: (id: string) => void;
}
```

**Features**:
- Sortable columns
- Status filtering
- Pagination support
- Row actions (edit, delete)

**Usage**:
```tsx
<CertificateTable 
  certificates={certificates}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### CertificateForm

**Location**: `components/certificates/CertificateForm.tsx`

**Description**: Form for creating/editing certificates

**Props**:
```typescript
interface CertificateFormProps {
  certificate?: CrewCertificate;
  crewMembers: CrewMaster[];
  certificateTypes: CertificateType[];
  onSubmit: (data: CertificateFormData) => Promise<void>;
  onCancel?: () => void;
}
```

**Features**:
- React Hook Form integration
- Zod validation
- Crew member selection
- Certificate type selection
- Date pickers for issue/expiry dates
- File upload for certificate documents

**Form Fields**:
- Crew Member (select)
- Certificate Type (select)
- Certificate Number (text)
- Issue Date (date)
- Expiry Date (date)
- Document Upload (file)

**Usage**:
```tsx
<CertificateForm
  certificate={certificate}
  crewMembers={crewMembers}
  certificateTypes={certificateTypes}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

---

### CertificateFilters

**Location**: `components/certificates/CertificateFilters.tsx`

**Description**: Filter controls for certificate listing

**Props**:
```typescript
interface CertificateFiltersProps {
  filters: CertificateFilters;
  onFilterChange: (filters: CertificateFilters) => void;
}
```

**Features**:
- Status filter (valid, expiring_soon, expired, revoked)
- Certificate type filter
- Crew member filter
- Date range filter (expiry date)
- Clear filters button

**Usage**:
```tsx
<CertificateFilters
  filters={filters}
  onFilterChange={setFilters}
/>
```

---

### StatusBadge

**Location**: `components/certificates/StatusBadge.tsx`

**Description**: Visual status indicator badge

**Props**:
```typescript
interface StatusBadgeProps {
  expiryDate: Date | string;
  status: CertificateStatus;
}
```

**Features**:
- Color-coded status (green, yellow, red)
- Days until expiry calculation
- Tooltip with detailed information

**Status Colors**:
- `valid`: Green
- `expiring_soon`: Yellow
- `expired`: Red
- `revoked`: Gray

**Usage**:
```tsx
<StatusBadge 
  expiryDate={certificate.expiryDate}
  status={certificate.status}
/>
```

---

## Layout Components

### Header

**Location**: `components/layout/Header.tsx`

**Description**: Top navigation bar with search, notifications, and user menu

**Features**:
- Dynamic page title based on route
- Global search bar
- Notification bell with indicator
- User dropdown menu (profile, settings, logout)
- Responsive design (search hidden on mobile)

**User Menu Items**:
- Profile
- Settings
- Logout

**Usage**:
```tsx
<Header />
```

**Dependencies**:
- NextAuth session
- Next.js navigation

---

### Sidebar

**Location**: `components/layout/Sidebar.tsx`

**Description**: Side navigation menu with main navigation links

**Features**:
- Navigation links
- Active route highlighting
- Collapsible sections
- Responsive design

**Navigation Items**:
- Dashboard
- Crew Management
- Certificates
- Vessels
- Contracts
- Analytics
- Settings

**Usage**:
```tsx
<Sidebar />
```

---

## UI Components

UI components are from **shadcn/ui** library (Radix UI primitives). Located in `components/ui/`.

### Button

**Location**: `components/ui/button.tsx`

**Description**: Button component with variants

**Variants**:
- `default`: Primary button
- `destructive`: Delete/danger actions
- `outline`: Outlined button
- `secondary`: Secondary button
- `ghost`: Ghost button (no background)
- `link`: Link-style button

**Sizes**:
- `default`: Standard size
- `sm`: Small
- `lg`: Large
- `icon`: Icon-only button

**Usage**:
```tsx
<Button variant="default" size="default">
  Click Me
</Button>
```

---

### Card

**Location**: `components/ui/card.tsx`

**Description**: Card container component

**Sub-components**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title
- `CardDescription`: Description text
- `CardContent`: Main content
- `CardFooter`: Footer section

**Usage**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

---

### Input

**Location**: `components/ui/input.tsx`

**Description**: Form input component

**Types**:
- `text`: Text input
- `email`: Email input
- `password`: Password input
- `number`: Number input
- `date`: Date input
- `search`: Search input

**Usage**:
```tsx
<Input 
  type="text" 
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Select

**Location**: `components/ui/select.tsx`

**Description**: Dropdown select component

**Sub-components**:
- `Select`: Main container
- `SelectTrigger`: Trigger button
- `SelectValue`: Display value
- `SelectContent`: Dropdown content
- `SelectItem`: Option item

**Usage**:
```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Table

**Location**: `components/ui/table.tsx`

**Description**: Table component for data display

**Sub-components**:
- `Table`: Main container
- `TableHeader`: Header row container
- `TableBody`: Body rows container
- `TableRow`: Row
- `TableHead`: Header cell
- `TableCell`: Data cell

**Usage**:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Badge

**Location**: `components/ui/badge.tsx`

**Description**: Badge component for status indicators

**Variants**:
- `default`: Default badge
- `secondary`: Secondary badge
- `destructive`: Error/danger badge
- `outline`: Outlined badge

**Usage**:
```tsx
<Badge variant="default">Active</Badge>
```

---

### DropdownMenu

**Location**: `components/ui/dropdown-menu.tsx`

**Description**: Dropdown menu component

**Sub-components**:
- `DropdownMenu`: Main container
- `DropdownMenuTrigger`: Trigger button
- `DropdownMenuContent`: Menu content
- `DropdownMenuItem`: Menu item
- `DropdownMenuLabel`: Section label
- `DropdownMenuSeparator`: Separator line

**Usage**:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Label

**Location**: `components/ui/label.tsx`

**Description**: Form label component

**Usage**:
```tsx
<Label htmlFor="input-id">Label Text</Label>
<Input id="input-id" />
```

---

## Component Patterns

### Form Handling Pattern

Components use **React Hook Form** with **Zod** validation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Handle submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

### Data Fetching Pattern

Components use **React Query** for data fetching:

```tsx
import { useQuery } from "@tanstack/react-query";

function CertificateList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const res = await fetch("/api/certificates");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(cert => <CertificateCard key={cert.id} certificate={cert} />)}
    </div>
  );
}
```

---

### Client Component Pattern

Components that use hooks or browser APIs are marked as client components:

```tsx
"use client";

import { useState } from "react";

export function MyComponent() {
  const [state, setState] = useState();
  // Component logic
}
```

---

### Type Safety Pattern

All components use TypeScript with strict types:

```tsx
interface MyComponentProps {
  id: string;
  name: string;
  optional?: boolean;
}

export function MyComponent({ id, name, optional }: MyComponentProps) {
  // Component implementation
}
```

---

## Styling

### Tailwind CSS

All components use **Tailwind CSS** for styling:

- Utility-first approach
- Responsive design with breakpoints
- Dark mode support (via CSS variables)
- Custom color scheme (maritime blue theme)

### Theme Colors

- **Primary**: Maritime Blue (#1E3A8A)
- **Secondary**: Teal (#0D9488)
- **Accent**: Various shades
- **Destructive**: Red for errors
- **Muted**: Gray for secondary text

---

## Accessibility

All components follow accessibility best practices:

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper ARIA attributes
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Semantic HTML

---

## Performance Considerations

### Code Splitting

- Components are code-split automatically by Next.js
- Dynamic imports for heavy components

### Memoization

- Use `React.memo` for expensive components
- Use `useMemo` and `useCallback` for expensive computations

### Image Optimization

- Use Next.js `Image` component for optimized images
- Lazy loading for below-the-fold content

---

## Testing

Component testing structure (to be implemented):

```tsx
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

---

**Last Updated**: November 2025
