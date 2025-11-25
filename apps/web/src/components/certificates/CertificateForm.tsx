"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificateFormData } from "@/lib/types/certificate";
import { useState } from "react";

const certificateSchema = z.object({
  crewId: z.string().min(1, "Crew member is required"),
  certificateTypeId: z.string().min(1, "Certificate type is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  documentUrl: z.string().optional(),
}).refine((data) => {
  const issueDate = new Date(data.issueDate);
  const expiryDate = new Date(data.expiryDate);
  return expiryDate > issueDate;
}, {
  message: "Expiry date must be after issue date",
  path: ["expiryDate"],
});

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => Promise<void>;
  certificateTypes: Array<{ id: string; name: string; code: string }>;
  crewMembers: Array<{ id: string; firstName: string; lastName: string; employeeId: string }>;
  loading?: boolean;
}

export function CertificateForm({
  onSubmit,
  certificateTypes,
  crewMembers,
  loading = false,
}: CertificateFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  });

  const [step, setStep] = useState(1);
  const selectedCrewId = watch("crewId");
  const selectedCertificateTypeId = watch("certificateTypeId");

  const onFormSubmit = async (data: CertificateFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Step 1: Select Crew Member */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 1: Select Crew Member</h3>
            <Label htmlFor="crewId">Crew Member *</Label>
            <Select
              value={selectedCrewId || ""}
              onValueChange={(value) => setValue("crewId", value)}
            >
              <SelectTrigger id="crewId">
                <SelectValue placeholder="Select a crew member" />
              </SelectTrigger>
              <SelectContent>
                {crewMembers.map((crew) => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.firstName} {crew.lastName} ({crew.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.crewId && (
              <p className="text-sm text-destructive mt-1">{errors.crewId.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setStep(2)} disabled={!selectedCrewId}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Certificate Type */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Select Certificate Type</h3>
            <Label htmlFor="certificateTypeId">Certificate Type *</Label>
            <Select
              value={selectedCertificateTypeId || ""}
              onValueChange={(value) => setValue("certificateTypeId", value)}
            >
              <SelectTrigger id="certificateTypeId">
                <SelectValue placeholder="Select a certificate type" />
              </SelectTrigger>
              <SelectContent>
                {certificateTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.certificateTypeId && (
              <p className="text-sm text-destructive mt-1">
                {errors.certificateTypeId.message}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(3)} disabled={!selectedCertificateTypeId}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Enter Details */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 3: Enter Certificate Details</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificateNumber">Certificate Number *</Label>
            <Input
              id="certificateNumber"
              {...register("certificateNumber")}
              placeholder="Enter certificate number"
            />
            {errors.certificateNumber && (
              <p className="text-sm text-destructive">{errors.certificateNumber.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                {...register("issueDate")}
              />
              {errors.issueDate && (
                <p className="text-sm text-destructive">{errors.issueDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                {...register("expiryDate")}
              />
              {errors.expiryDate && (
                <p className="text-sm text-destructive">{errors.expiryDate.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="documentUrl">Document URL (Optional)</Label>
            <Input
              id="documentUrl"
              type="url"
              {...register("documentUrl")}
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Certificate"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
