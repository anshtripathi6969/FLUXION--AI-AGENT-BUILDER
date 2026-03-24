"use client";

import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { PreviewSection } from "@/features/landing/components/preview-section";
import { CTAFooter } from "@/features/landing/components/cta-footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-[#030305]">
      {/* ─── Fixed full-page animated grid background ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
        {/* Radial vignette — fades grid at edges */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 25%, #030305 80%)",
          }}
        />
        {/* Scanning beam — vertical sweep */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 35%, rgba(99,102,241,0.12) 50%, transparent 65%, transparent 100%)",
            backgroundSize: "100% 200%",
            animation: "gridScanV 12s ease-in-out infinite",
          }}
        />
        {/* Scanning beam — horizontal sweep */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, transparent 35%, rgba(139,92,246,0.08) 50%, transparent 65%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "gridScanH 16s ease-in-out infinite",
          }}
        />
        {/* Ambient orbs */}
        <div className="absolute top-[15%] left-[25%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.12] blur-[140px]" />
        <div className="absolute bottom-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/[0.10] blur-[120px]" />
      </div>

      {/* ─── Page content sits above the grid ─── */}
      <div className="relative z-10">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PreviewSection />
        <CTAFooter />
      </div>
    </div>
  );
}
