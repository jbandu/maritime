import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import LandingPageClient from "./(public)/page";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }
  
  // Otherwise, show landing page
  return <LandingPageClient />;
}
