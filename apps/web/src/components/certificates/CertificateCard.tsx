"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { CrewCertificate } from "@/lib/types/certificate";
import { format } from "date-fns";

interface CertificateCardProps {
  certificate: CrewCertificate;
  onView?: (certificate: CrewCertificate) => void;
}

export function CertificateCard({ certificate, onView }: CertificateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {certificate.certificateType.name}
            </CardTitle>
            <CardDescription>{certificate.certificateType.code}</CardDescription>
          </div>
          <StatusBadge
            expiryDate={certificate.expiryDate}
            status={certificate.status}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Crew:</span>{" "}
            {certificate.crew.firstName} {certificate.crew.lastName}
            <span className="text-muted-foreground ml-2">
              ({certificate.crew.employeeId})
            </span>
          </div>
          <div>
            <span className="font-medium">Certificate Number:</span>{" "}
            {certificate.certificateNumber}
          </div>
          <div>
            <span className="font-medium">Issue Date:</span>{" "}
            {format(new Date(certificate.issueDate), "MMM dd, yyyy")}
          </div>
          <div>
            <span className="font-medium">Expiry Date:</span>{" "}
            {format(new Date(certificate.expiryDate), "MMM dd, yyyy")}
          </div>
          {onView && (
            <div className="pt-2">
              <button
                onClick={() => onView(certificate)}
                className="text-primary hover:underline text-sm font-medium"
              >
                View Details →
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
