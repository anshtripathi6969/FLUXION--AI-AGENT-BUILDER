"use client";

import { useEffect, useRef } from "react";
import {
  Workflow,
  Sparkles,
  Zap,
  Plug,
  History,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Visual Workflow Builder",
    description:
      "Drag-and-drop interface to design complex automation pipelines with zero code required.",
    color: "#3b82f6",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Nodes",
    description:
      "Leverage OpenAI, Gemini, and Anthropic models directly inside your workflow nodes.",
    color: "#8b5cf6",
  },
  {
    icon: Zap,
    title: "Real-Time Execution",
    description:
      "Execute workflows instantly with live status updates and streaming results.",
    color: "#f59e0b",
  },
  {
    icon: Plug,
    title: "Integrations",
    description:
      "Connect with Slack, Discord, Stripe, and hundreds of APIs through HTTP nodes.",
    color: "#10b981",
  },
  {
    icon: History,
    title: "Execution History & Logs",
    description:
      "Full audit trail of every workflow run with detailed logs and performance metrics.",
    color: "#06b6d4",
  },
  {
    icon: ShieldCheck,
    title: "Secure Credentials",
    description:
      "Enterprise-grade credential vault with encrypted storage for all your API keys.",
    color: "#f43f5e",
  },
];

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctxByGsap: any;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".feature-card");
        ctxByGsap = gsap.context(() => {
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    };
    init();
    return () => ctxByGsap?.revert?.();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 px-6"
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent-text)] mb-4 block">
          Features
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--landing-text-primary)] mb-4">
          Everything you need to automate
        </h2>
        <p className="text-base text-[var(--landing-text-secondary)] max-w-xl mx-auto font-medium">
          A complete toolkit for building, running, and monitoring AI-powered workflows at scale.
        </p>
      </div>

      {/* Cards grid */}
      <div
        ref={cardsRef}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="feature-card group relative rounded-2xl p-7 bg-[#0c0c10] border border-[#1a1a22] hover:border-[#262630] hover:bg-[#111116] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="relative z-10">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border transition-colors duration-300"
                style={{
                  borderColor: `color-mix(in srgb, ${feature.color} 12%, #0c0c10)`,
                  backgroundColor: `color-mix(in srgb, ${feature.color} 5%, #0c0c10)`,
                }}
              >
                <feature.icon
                  className="w-5 h-5"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-base font-semibold text-[var(--landing-text-primary)] mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--landing-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
