"use client";

import { useState } from "react";
import { Hero } from "@/components/landing/Hero";
import { Navigation } from "@/components/landing/Navigation";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { AIAgentsShowcase } from "@/components/landing/AIAgentsShowcase";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { DemoVideoSection } from "@/components/landing/DemoVideoSection";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";
import { MobileAppSection } from "@/components/landing/MobileAppSection";
import { SecurityBadges } from "@/components/landing/SecurityBadges";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { LoginModal } from "@/components/landing/LoginModal";

export default function LandingPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <FeatureGrid />
      <AIAgentsShowcase />
      <DashboardPreview />
      <DemoVideoSection />
      <TestimonialCarousel />
      <MobileAppSection />
      <SecurityBadges />
      <FAQ />
      <FinalCTA />
      <Footer />
      <ScrollToTop />
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </main>
  );
}
