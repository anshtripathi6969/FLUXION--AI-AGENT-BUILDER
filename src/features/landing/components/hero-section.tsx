"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, Sparkles, Send, Database, Zap } from "lucide-react";

/* ─── Floating particle for background ─── */
const Particle = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <motion.div
    className="absolute rounded-full bg-blue-500/20 blur-[2px]"
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      y: [0, -40, 0],
      opacity: [0.1, 0.8, 0.1],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

/* ─── Live Floating Workflow Data ─── */
const floatingNodes = [
  { id: "n1", label: "Webhook Init", icon: Globe, color: "#f59e0b", x: 14, y: 25 },
  { id: "n2", label: "AI Analysis", icon: Sparkles, color: "#8b5cf6", x: 22, y: 65 },
  { id: "n3", label: "Slack Notify", icon: Send, color: "#3b82f6", x: 84, y: 20 },
  { id: "n4", label: "Store Lead", icon: Database, color: "#10b981", x: 88, y: 60 },
  { id: "n5", label: "Trigger Action", icon: Zap, color: "#f43f5e", x: 74, y: 80 },
];

const floatingConnections = [
  { from: 0, to: 1, delay: 0, color: "#8b5cf6" },
  { from: 0, to: 2, delay: 1.5, color: "#3b82f6" },
  { from: 1, to: 3, delay: 2.5, color: "#10b981" },
  { from: 1, to: 4, delay: 3.5, color: "#f43f5e" },
  { from: 2, to: 3, delay: 1.0, color: "#10b981" },
];

export const HeroSection = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* GSAP scroll parallax on the background */
  useEffect(() => {
    if (!mounted) return;
    let ctx: any;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (bgRef.current) {
        ctx = gsap.context(() => {
          gsap.to(bgRef.current, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
              trigger: bgRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }
    };
    init();
    return () => ctx?.revert?.();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ─── Base Ambient Grid & Particles ─── */}
      <div ref={bgRef} className="absolute inset-0 -z-20 pointer-events-none">
        <Particle delay={0} size={5} x="15%" y="20%" />
        <Particle delay={1} size={4} x="80%" y="30%" />
        <Particle delay={2} size={6} x="40%" y="70%" />
        <Particle delay={0.5} size={4} x="65%" y="15%" />
        <Particle delay={1.5} size={5} x="25%" y="80%" />
        <Particle delay={3} size={4} x="85%" y="75%" />
        <Particle delay={2.5} size={5} x="50%" y="40%" />
      </div>

      {/* ─── Animated Live Workflow Overlay ─── */}
      <div className="absolute inset-0 -z-10 pointer-events-none hidden md:block">
        {/* SVG Connections */}
        {/* SVG Connections - Client only to avoid hydration mismatches */}
        {mounted && (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {floatingConnections.map((conn, i) => {
                const from = floatingNodes[conn.from];
                const to = floatingNodes[conn.to];
                return (
                  <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={from.color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={to.color} stopOpacity="0.8" />
                  </linearGradient>
                );
              })}
            </defs>

            {floatingConnections.map((conn, i) => {
              const from = floatingNodes[conn.from];
              const to = floatingNodes[conn.to];
              const cx = (from.x + to.x) / 2;
              const pathD = `M ${from.x} ${from.y} C ${cx} ${from.y}, ${cx} ${to.y}, ${to.x} ${to.y}`;

              return (
                <g key={i}>
                  {/* High-energy traveling beam (long tail) */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={conn.color}
                    strokeWidth="0.25"
                    strokeLinecap="round"
                    filter="url(#heroGlow)"
                    initial={{ pathLength: 0.15, pathOffset: 0, opacity: 0 }}
                    animate={{
                      pathOffset: [0, 1],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 4,
                      delay: conn.delay,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* 4. Ultrabright core particle at the head of the beam */}
                  <motion.circle
                    r="0.4"
                    fill="#ffffff"
                    filter="url(#heroGlow)"
                    initial={{ opacity: 0 }}
                    animate={{
                      offsetDistance: "100%",
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 4,
                      delay: conn.delay,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ 
                      offsetPath: `path('${pathD}')`,
                      offsetDistance: "0%",
                    } as any}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* The Nodes */}
        {floatingNodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute flex items-center gap-3 px-3 py-2 rounded-xl border z-10"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              background: "rgba(10,10,16,0.6)",
              backdropFilter: "blur(20px)",
              borderColor: `color-mix(in srgb, ${node.color} 20%, transparent)`,
            }}
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            {/* Ambient glow behind node */}
            <div
              className="absolute inset-0 rounded-xl blur-xl opacity-30 pointer-events-none"
              style={{ background: `color-mix(in srgb, ${node.color} 30%, transparent)` }}
            />

            <div
              className="relative w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{
                background: `color-mix(in srgb, ${node.color} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${node.color} 30%, transparent)`,
              }}
            >
              <node.icon className="w-4 h-4" style={{ color: node.color }} />
              {/* Subtle pulse */}
              <motion.div
                className="absolute inset-0 rounded-lg border"
                style={{ borderColor: node.color }}
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              />
            </div>
            <span className="text-xs font-semibold tracking-wide text-white/90">
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ─── Content ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 max-w-4xl mx-auto px-6 text-center pt-24"
      >


        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05] mb-8">
          Automate. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Scale. Create.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          The ultimate visual engine for modern teams. Build powerful AI workflows,
          wire APIs visually, and execute effortlessly in real-time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group relative px-8 py-4 rounded-2xl text-[15px] font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)] bg-[length:200%_auto] hover:bg-[position:right_center]"
          >
            Start Building Free
            <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </Link>
          <a
            href="#preview"
            className="group px-8 py-4 rounded-2xl text-[15px] font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
          >
            Watch Demo
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-28 flex justify-center opacity-60">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border border-white/20 flex flex-col items-center justify-start p-1.5"
          >
            <motion.div className="w-1 h-2.5 rounded-full bg-white/50" />
          </motion.div>
        </div>
      </motion.div>

      {/* Hero ambient base glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[150px] pointer-events-none -z-10" />
    </section>
  );
};
