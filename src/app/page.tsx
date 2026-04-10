"use client";

import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { IntegrationsSection } from "@/features/landing/components/integrations-section";
import { PreviewSection } from "@/features/landing/components/preview-section";
import { CTAFooter } from "@/features/landing/components/cta-footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-[var(--landing-text-primary)] overflow-x-hidden" style={{ backgroundColor: 'var(--landing-bg)' }}>
      <div className="relative z-10">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <IntegrationsSection />
        <PreviewSection />
        <CTAFooter />
      </div>
    </div>
  );
}
