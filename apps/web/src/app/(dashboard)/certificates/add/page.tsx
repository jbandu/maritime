"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CertificateForm } from "@/components/certificates/CertificateForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CertificateFormData } from "@/lib/types/certificate";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

async function createCertificate(data: CertificateFormData) {
  const response = await fetch("/api/certificates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create certificate");
  }

  return response.json();
}

export default function AddCertificatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data: certificateTypes = [], isLoading: loadingTypes } = useQuery({
    queryKey: ["certificateTypes"],
    queryFn: fetchCertificateTypes,
  });

  const { data: crewMembers = [], isLoading: loadingCrew } = useQuery({
    queryKey: ["crewMembers"],
    queryFn: fetchCrewMembers,
  });

  const mutation = useMutation({
    mutationFn: createCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      setSuccess(true);
      setTimeout(() => {
        router.push("/certificates");
      }, 2000);
    },
  });

  const handleSubmit = async (data: CertificateFormData) => {
    await mutation.mutateAsync(data);
  };

  if (loadingTypes || loadingCrew) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Success!</CardTitle>
            <CardDescription>
              Certificate created successfully. Redirecting...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/certificates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Certificate</h1>
          <p className="text-muted-foreground mt-1">
            Create a new certificate for a crew member
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Information</CardTitle>
          <CardDescription>
            Fill in the details to create a new certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mutation.isError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "An error occurred"}
            </div>
          )}
          <CertificateForm
            onSubmit={handleSubmit}
            certificateTypes={certificateTypes}
            crewMembers={crewMembers}
            loading={mutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
