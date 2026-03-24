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
    color: "from-blue-500/20 to-blue-600/5",
    glow: "group-hover:shadow-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Nodes",
    description:
      "Leverage OpenAI, Gemini, and Anthropic models directly inside your workflow nodes.",
    color: "from-violet-500/20 to-violet-600/5",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    icon: Zap,
    title: "Real-Time Execution",
    description:
      "Execute workflows instantly with live status updates and streaming results.",
    color: "from-amber-500/20 to-amber-600/5",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Plug,
    title: "Integrations",
    description:
      "Connect with Slack, Discord, Stripe, and hundreds of APIs through HTTP nodes.",
    color: "from-emerald-500/20 to-emerald-600/5",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: History,
    title: "Execution History & Logs",
    description:
      "Full audit trail of every workflow run with detailed logs and performance metrics.",
    color: "from-cyan-500/20 to-cyan-600/5",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure Credentials",
    description:
      "Enterprise-grade credential vault with encrypted storage for all your API keys.",
    color: "from-rose-500/20 to-rose-600/5",
    glow: "group-hover:shadow-rose-500/10",
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
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
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
      className="relative py-32 px-6"
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4 block">
          Features
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Everything you need to automate
        </h2>
        <p className="text-base text-slate-400 max-w-xl mx-auto font-medium">
          A complete toolkit for building, running, and monitoring AI-powered workflows at scale.
        </p>
      </div>

      {/* Cards grid */}
      <div
        ref={cardsRef}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className={`feature-card group relative bg-[#030305]/60 backdrop-blur-2xl border border-white/5 hover:border-white/10 rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px] ${feature.glow}`}
          >
            {/* Gradient bg on hover */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
            />

            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <feature.icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
