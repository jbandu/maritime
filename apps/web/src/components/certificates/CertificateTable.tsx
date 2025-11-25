"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { CrewCertificate } from "@/lib/types/certificate";
import { format } from "date-fns";

interface CertificateTableProps {
  certificates: CrewCertificate[];
  onView?: (certificate: CrewCertificate) => void;
}

export function CertificateTable({
  certificates,
  onView,
}: CertificateTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Crew Name</TableHead>
            <TableHead>Certificate Type</TableHead>
            <TableHead>Certificate Number</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No certificates found
              </TableCell>
            </TableRow>
          ) : (
            certificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell className="font-medium">
                  {certificate.crew.firstName} {certificate.crew.lastName}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {certificate.crew.employeeId}
                  </span>
                </TableCell>
                <TableCell>
                  {certificate.certificateType.name}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {certificate.certificateType.code}
                  </span>
                </TableCell>
                <TableCell>{certificate.certificateNumber}</TableCell>
                <TableCell>
                  {format(new Date(certificate.issueDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(certificate.expiryDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    expiryDate={certificate.expiryDate}
                    status={certificate.status}
                  />
                </TableCell>
                <TableCell>
                  {onView && (
                    <button
                      onClick={() => onView(certificate)}
                      className="text-primary hover:underline text-sm"
                    >
                      View
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
