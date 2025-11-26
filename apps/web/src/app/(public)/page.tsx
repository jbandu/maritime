"use client";

import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { AIAgentsShowcase } from "@/components/landing/AIAgentsShowcase";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";
import { SecurityBadges } from "@/components/landing/SecurityBadges";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeatureGrid />
      <AIAgentsShowcase />
      <DashboardPreview />
      <TestimonialCarousel />
      <SecurityBadges />
      <FinalCTA />
      <Footer />
    </main>
  );
}
