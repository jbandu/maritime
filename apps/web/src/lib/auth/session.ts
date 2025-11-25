import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
