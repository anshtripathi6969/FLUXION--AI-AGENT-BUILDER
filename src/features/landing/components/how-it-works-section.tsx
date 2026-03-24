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
    gradient: "from-blue-500 to-cyan-400",
    glow: "bg-blue-500/20",
  },
  {
    step: "02",
    icon: Blocks,
    title: "Add Nodes",
    description: "Drop in AI, HTTP, triggers, and logic nodes to build your pipeline.",
    gradient: "from-violet-500 to-purple-400",
    glow: "bg-violet-500/20",
  },
  {
    step: "03",
    icon: Cable,
    title: "Connect & Execute",
    description: "Wire nodes together and run your workflow with a single click.",
    gradient: "from-indigo-500 to-blue-400",
    glow: "bg-indigo-500/20",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Monitor Results",
    description: "Track execution status, view logs, and analyze performance in real-time.",
    gradient: "from-emerald-500 to-teal-400",
    glow: "bg-emerald-500/20",
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
        const connectors = sectionRef.current.querySelectorAll(".step-connector-line");

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          });

          // Stagger cards in
          cards.forEach((card, i) => {
            tl.fromTo(
              card,
              { y: 60, opacity: 0, scale: 0.95 },
              { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
              i * 0.15
            );
          });

          // Animate connector lines
          connectors.forEach((connector, i) => {
            tl.fromTo(
              connector,
              { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
              i * 0.15 + 0.35
            );
          });
        });
      }
    };
    init();
    return () => ctx?.revert?.();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-32 px-6">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4 block">
          How it works
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          From idea to automation in minutes
        </h2>
        <p className="text-base text-slate-400 max-w-xl mx-auto font-medium">
          Four simple steps to build and deploy powerful AI workflows.
        </p>
      </div>

      {/* Steps row */}
      <div className="max-w-6xl mx-auto relative">
        {/* Full connector track (desktop) */}
        <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px">
          <div className="w-full h-full bg-gradient-to-r from-blue-500/10 via-violet-500/20 to-emerald-500/10 rounded-full" />
          {/* Animated pulse traveling along connector */}
          <div
            className="absolute top-0 left-0 h-full w-[120px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)",
              animation: "connectorPulse 3s ease-in-out infinite",
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {/* Connector segments (desktop) */}
              {i < steps.length - 1 && (
                <div className="step-connector-line hidden md:block absolute top-[52px] left-[calc(50%+32px)] w-[calc(100%-32px)] h-px origin-left">
                  <div className="w-full h-full bg-gradient-to-r from-white/15 to-white/5 rounded-full" />
                  {/* Glowing dot on connector */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40"
                    animate={{
                      left: ["0%", "100%"],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}

              {/* Step card */}
              <div className="step-card group flex flex-col items-center text-center">
                {/* Icon container with glow */}
                <div className="relative mb-6">
                  {/* Ambient glow behind icon */}
                  <div className={`absolute inset-0 ${step.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150`} />

                  {/* Icon box */}
                  <div className="relative w-[68px] h-[68px] rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/[0.08] transition-all duration-500">
                    <step.icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-500" />

                    {/* Animated ring on hover */}
                    <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  </div>

                  {/* Step badge */}
                  <span className={`absolute -top-2.5 -right-2.5 text-[10px] font-bold bg-gradient-to-br ${step.gradient} text-white rounded-lg px-2 py-0.5 shadow-lg`}>
                    {step.step}
                  </span>

                  {/* Pulse ring (always animating subtly) */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl border ${step.glow.replace("bg-", "border-").replace("/20", "/30")}`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 max-w-[220px] leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-500">
                  {step.description}
                </p>

                {/* Bottom glow line on hover */}
                <div className={`mt-4 h-px w-0 group-hover:w-16 bg-gradient-to-r ${step.gradient} transition-all duration-700 rounded-full opacity-50`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for connector pulse animation */}
      <style>{`
        @keyframes connectorPulse {
          0%, 100% { left: -120px; }
          50% { left: calc(100%); }
        }
      `}</style>
    </section>
  );
};
