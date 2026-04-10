"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const integrations = [
  { name: "OpenAI", logo: "/logos/openai.svg", category: "AI", invert: true },
  { name: "Gemini", logo: "/logos/gemini.svg", category: "AI", invert: false },
  { name: "Anthropic", logo: "/logos/anthropic.svg", category: "AI", invert: false },
  { name: "Slack", logo: "/logos/slack.svg", category: "Communication", invert: false },
  { name: "Discord", logo: "/logos/discord.svg", category: "Communication", invert: false },
  { name: "Stripe", logo: "/logos/stripe.svg", category: "Payments", invert: false },
  { name: "GitHub", logo: "/logos/github.svg", category: "Developer", invert: true },
  { name: "Google Cloud", logo: "/logos/google.svg", category: "Cloud", invert: false },
];

export const IntegrationsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    let cancelled = false;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll(".integration-item");
        ctx = gsap.context(() => {
          gsap.fromTo(
            items,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.06,
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
    return () => {
      cancelled = true;
      ctx?.revert?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-14 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent-text)] mb-4 block">
          Integrations
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--landing-text-primary)] mb-4">
          Connect with everything
        </h2>
        <p className="text-base text-[var(--landing-text-secondary)] max-w-xl mx-auto font-medium">
          Plug into the tools your team already uses. From AI models to messaging platforms and payment systems.
        </p>
      </div>

      {/* Integration grid */}
      <div
        ref={gridRef}
        className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {integrations.map((item) => (
          <div
            key={item.name}
            className="integration-item group relative rounded-xl p-6 bg-[#0c0c10] border border-[#1a1a22] hover:border-[#262630] hover:bg-[#111116] transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image
                src={item.logo}
                alt={item.name}
                width={32}
                height={32}
                className={`object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${item.invert ? "brightness-0 invert" : ""}`}
              />
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold text-[var(--landing-text-primary)] block">
                {item.name}
              </span>
              <span className="text-[10px] font-medium text-[var(--landing-text-tertiary)] uppercase tracking-wider">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* "And more" indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <span className="text-sm text-[var(--landing-text-tertiary)] font-medium">
          + HTTP nodes for any REST API
        </span>
      </motion.div>
    </section>
  );
};
