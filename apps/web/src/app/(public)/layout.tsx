import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maritime Crew Portal - Manage Your Career",
  description:
    "Track certificates, log work hours, view contracts. 100% MLC compliant. Free for all crew members.",
  keywords: "maritime, crew, certificates, STCW, MLC, seafarer",
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
