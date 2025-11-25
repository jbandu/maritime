"use client";

import { useQuery } from "@tanstack/react-query";
import { CertificateCard } from "@/components/certificates/CertificateCard";
import { Badge } from "@/components/ui/badge";
import { CrewCertificate } from "@/lib/types/certificate";
import { getCertificateStatus } from "@/lib/types/certificate";

async function fetchExpiringCertificates(days: number = 90) {
  const response = await fetch(`/api/certificates/expiring?days=${days}`);
  if (!response.ok) throw new Error("Failed to fetch expiring certificates");
  return response.json();
}

export default function ExpiringCertificatesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["expiringCertificates", 90],
    queryFn: () => fetchExpiringCertificates(90),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading expiring certificates...</div>
      </div>
    );
  }

  const grouped = {
    expired: data?.expired || [],
    critical: data?.critical || [],
    urgent: data?.urgent || [],
    warning: data?.warning || [],
  };

  const totalCount =
    grouped.expired.length +
    grouped.critical.length +
    grouped.urgent.length +
    grouped.warning.length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Expiring Certificates</h1>
        <p className="text-muted-foreground mt-1">
          Certificates expiring in the next 90 days
        </p>
        <div className="mt-4 flex gap-4">
          <Badge variant="destructive">
            Expired: {grouped.expired.length}
          </Badge>
          <Badge variant="destructive">
            Critical (&lt;14d): {grouped.critical.length}
          </Badge>
          <Badge variant="default">
            Urgent (&lt;30d): {grouped.urgent.length}
          </Badge>
          <Badge variant="secondary">
            Warning (&lt;60d): {grouped.warning.length}
          </Badge>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No certificates expiring in the next 90 days
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.expired.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-destructive">
                Expired ({grouped.expired.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.expired.map((cert: CrewCertificate) => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            </div>
          )}

          {grouped.critical.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-destructive">
                Critical - Expiring in &lt;14 days ({grouped.critical.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.critical.map((cert: CrewCertificate) => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            </div>
          )}

          {grouped.urgent.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Urgent - Expiring in &lt;30 days ({grouped.urgent.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.urgent.map((cert: CrewCertificate) => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            </div>
          )}

          {grouped.warning.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Warning - Expiring in &lt;60 days ({grouped.warning.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.warning.map((cert: CrewCertificate) => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
