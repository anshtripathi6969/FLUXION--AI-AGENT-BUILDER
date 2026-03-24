"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Sparkles, Zap, Database } from "lucide-react";

/* ─── Shared Animated Grid Background ─── */

const AuthGrid = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Basic Grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    />
    {/* Vignette */}
    <div
      className="absolute inset-0"
      style={{
        background: "radial-gradient(circle at center, transparent 0%, #030305 90%)",
      }}
    />
    {/* Scanning Beams */}
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.08) 50%, transparent 100%)",
        backgroundSize: "100% 200%",
        animation: "gridScanV 15s ease-in-out infinite",
      }}
    />
  </div>
);

/* ─── Mini Workflow Constellation ─── */

const floatingNodes = [
  { icon: Globe, color: "#3b82f6", x: 15, y: 25 },
  { icon: Sparkles, color: "#8b5cf6", x: 85, y: 20 },
  { icon: Zap, color: "#f59e0b", x: 20, y: 75 },
  { icon: Database, color: "#10b981", x: 80, y: 80 },
];

export function AuthVisuals() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="absolute inset-0 bg-[#030305]" />;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030305]">
      <AuthGrid />

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />

      {/* LOGO + BRANDING (Above the card) */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-4 bg-indigo-500/20 blur-lg rounded-full opacity-100" />
            <Globe className="w-10 h-10 text-indigo-500 relative z-10" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            Fluxion <span className="text-indigo-400">AI</span>
          </span>
        </motion.div>
      </div>

      {/* Floating Constellation (Auth-Specific) */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        {floatingNodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute p-4 rounded-2xl bg-[#0a0a10]/60 backdrop-blur-xl border border-white/5 flex items-center justify-center shadow-2xl"
            style={{ 
              left: `${node.x}%`, 
              top: `${node.y}%`,
              boxShadow: `0 0 40px -10px ${node.color}20` 
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <node.icon className="w-6 h-6" style={{ color: node.color }} />
            <motion.div 
              className="absolute inset-0 rounded-2xl border"
              style={{ borderColor: node.color }}
              animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          </motion.div>
        ))}
        
        {/* Abstract connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path 
            d="M 15 25 Q 50 50 85 20 M 20 75 Q 50 50 80 80"
            fill="none" 
            stroke="white" 
            strokeWidth="0.1"
            strokeDasharray="1 2"
            animate={{ strokeDashoffset: [0, 50] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    </div>
  );
}
