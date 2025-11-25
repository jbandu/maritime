"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CertificateFilters as FilterType } from "@/lib/types/certificate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CertificateFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  certificateTypes: Array<{ id: string; name: string; code: string }>;
  crewMembers: Array<{ id: string; firstName: string; lastName: string; employeeId: string }>;
  onReset: () => void;
}

export function CertificateFilters({
  filters,
  onFiltersChange,
  certificateTypes,
  crewMembers,
  onReset,
}: CertificateFiltersProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Crew name or certificate number..."
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="certificateType">Certificate Type</Label>
          <Select
            value={filters.certificateTypeId || ""}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                certificateTypeId: value || undefined,
              })
            }
          >
            <SelectTrigger id="certificateType">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {certificateTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="crew">Crew Member</Label>
          <Select
            value={filters.crewId || ""}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, crewId: value || undefined })
            }
          >
            <SelectTrigger id="crew">
              <SelectValue placeholder="All crew" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All crew</SelectItem>
              {crewMembers.map((crew) => (
                <SelectItem key={crew.id} value={crew.id}>
                  {crew.firstName} {crew.lastName} ({crew.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value || undefined })
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onReset} variant="outline" size="sm">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
