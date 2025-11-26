import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maritime Crew Portal - Certificates, Contracts & Compliance",
  description:
    "Manage your maritime certificates, contracts, and work hours. 100% MLC compliant. Free for all crew members. Access from ship or shore.",
  keywords: "maritime, crew, certificates, STCW, MLC, seafarer, work hours, compliance",
  openGraph: {
    title: "Maritime Crew Portal",
    description: "Your maritime career, simplified",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maritime Crew Portal",
    description: "Your maritime career, simplified",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
