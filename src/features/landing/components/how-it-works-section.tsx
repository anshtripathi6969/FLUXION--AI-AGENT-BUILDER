"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PenTool, Blocks, Cable, BarChart3 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: PenTool,
    title: "Create Workflow",
    description: "Start with a blank canvas or choose from pre-built templates.",
  },
  {
    step: "02",
    icon: Blocks,
    title: "Add Nodes",
    description: "Drop in AI, HTTP, triggers, and logic nodes to build your pipeline.",
  },
  {
    step: "03",
    icon: Cable,
    title: "Connect & Execute",
    description: "Wire nodes together and run your workflow with a single click.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Monitor Results",
    description: "Track execution status, view logs, and analyze performance in real-time.",
  },
];

export const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (sectionRef.current) {
        const cards = sectionRef.current.querySelectorAll(".step-card");
        ctx = gsap.context(() => {
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 65%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    };
    init();
    return () => ctx?.revert?.();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 px-6">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent-text)] mb-4 block">
          How it works
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--landing-text-primary)] mb-4">
          From idea to automation in minutes
        </h2>
        <p className="text-base text-[var(--landing-text-secondary)] max-w-xl mx-auto font-medium">
          Four simple steps to build and deploy powerful AI workflows.
        </p>
      </div>

      {/* Steps row */}
      <div className="max-w-5xl mx-auto relative">
        {/* Connector line (desktop) — minimal solid */}
        <div className="hidden md:block absolute top-[32px] left-[12.5%] right-[12.5%] h-px bg-[#1a1a22]">
          {/* Traveling dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--landing-accent-text)]"
            animate={{
              left: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step) => (
            <div key={step.step} className="step-card group flex flex-col items-center text-center">
              {/* Icon container */}
              <div className="relative mb-6">
                <div
                  className="w-16 h-16 rounded-2xl bg-[#0c0c10] border border-[#1a1a22] flex items-center justify-center group-hover:border-[#262630] group-hover:bg-[#111116] transition-all duration-300"
                >
                  <step.icon className="w-6 h-6 text-[var(--landing-text-secondary)] group-hover:text-[var(--landing-text-primary)] transition-colors duration-300" />
                </div>
              </div>

              {/* Step number */}
              <span className="text-[11px] font-mono font-medium text-[var(--landing-accent-text)] tracking-wider mb-2">
                {step.step}
              </span>

              {/* Title */}
              <h3 className="text-base font-semibold text-[var(--landing-text-primary)] mb-2 tracking-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--landing-text-secondary)] max-w-[200px] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
