"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CertificateTable } from "@/components/certificates/CertificateTable";
import { CertificateFilters } from "@/components/certificates/CertificateFilters";
import { Button } from "@/components/ui/button";
import { CertificateFilters as FilterType, CrewCertificate } from "@/lib/types/certificate";
import Link from "next/link";
import { Plus } from "lucide-react";

async function fetchCertificates(filters: FilterType, page: number = 1, limit: number = 10) {
  const params = new URLSearchParams();
  if (filters.crewId) params.append("crewId", filters.crewId);
  if (filters.certificateTypeId) params.append("certificateTypeId", filters.certificateTypeId);
  if (filters.status) params.append("status", filters.status);
  if (filters.expiryBefore) params.append("expiryBefore", filters.expiryBefore);
  if (filters.expiryAfter) params.append("expiryAfter", filters.expiryAfter);
  if (filters.search) params.append("search", filters.search);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await fetch(`/api/certificates?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch certificates");
  return response.json();
}

async function fetchCertificateTypes() {
  const response = await fetch("/api/certificates/types");
  if (!response.ok) throw new Error("Failed to fetch certificate types");
  return response.json();
}

async function fetchCrewMembers() {
  const response = await fetch("/api/crew");
  if (!response.ok) throw new Error("Failed to fetch crew members");
  return response.json();
}

export default function CertificatesPage() {
  const [filters, setFilters] = useState<FilterType>({});
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: certificatesData, isLoading: loadingCertificates } = useQuery({
    queryKey: ["certificates", filters, page],
    queryFn: () => fetchCertificates(filters, page, limit),
  });

  const { data: certificateTypes = [] } = useQuery({
    queryKey: ["certificateTypes"],
    queryFn: fetchCertificateTypes,
  });

  const { data: crewMembers = [] } = useQuery({
    queryKey: ["crewMembers"],
    queryFn: fetchCrewMembers,
  });

  const handleView = (certificate: CrewCertificate) => {
    // TODO: Implement view details modal/page
    console.log("View certificate:", certificate);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground mt-1">
            Manage crew certificates and track expirations
          </p>
        </div>
        <Link href="/certificates/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </Link>
      </div>

      <CertificateFilters
        filters={filters}
        onFiltersChange={setFilters}
        certificateTypes={certificateTypes}
        crewMembers={crewMembers}
        onReset={handleResetFilters}
      />

      {loadingCertificates ? (
        <div className="text-center py-8">Loading certificates...</div>
      ) : (
        <>
          <CertificateTable
            certificates={certificatesData?.certificates || []}
            onView={handleView}
          />
          
          {certificatesData && certificatesData.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} of {certificatesData.totalPages} ({certificatesData.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(certificatesData.totalPages, p + 1))}
                  disabled={page === certificatesData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
