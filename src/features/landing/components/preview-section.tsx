"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sparkles,
  Send,
  Database,
  Globe,
  CheckCircle2,
  Play,
  Loader2,
} from "lucide-react";

/* ─── Node data ─── */
const nodesDef = [
  { id: "trigger", label: "HTTP Trigger", icon: Globe, type: "trigger" as const, x: 18, y: 25 },
  { id: "ai", label: "GPT-4 Process", icon: Sparkles, type: "ai" as const, x: 42, y: 45 },
  { id: "action", label: "Send to Slack", icon: Send, type: "action" as const, x: 68, y: 25 },
  { id: "save", label: "Save to DB", icon: Database, type: "output" as const, x: 68, y: 65 },
  { id: "notify", label: "Email Alert", icon: Zap, type: "action" as const, x: 82, y: 45 },
];

const colors = {
  trigger: { accent: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
  ai:      { accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.3)" },
  action:  { accent: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)" },
  output:  { accent: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.3)" },
};

const statusColors = {
  completed: "#10b981",
  running: "#8b5cf6",
  pending: "#334155", // darker gray for better contrast
  error: "#ef4444",
};

/* ─── Connections ─── */
const connections = [
  { id: "c1", from: "trigger", to: "ai", activeAt: 1 },
  { id: "c2", from: "ai", to: "action", activeAt: 2 },
  { id: "c3", from: "ai", to: "save", activeAt: 2 },
  { id: "c4", from: "action", to: "notify", activeAt: 3 },
];

type NodeStatus = "pending" | "running" | "completed";

const FakeNode = ({
  node,
  status,
  delay,
}: {
  node: typeof nodesDef[0];
  status: NodeStatus;
  delay: number;
}) => {
  const c = colors[node.type];
  const sc = statusColors[status];
  const isRunning = status === "running";
  const isCompleted = status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="absolute group cursor-default"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Intense glow when running */}
      <motion.div
        className="absolute inset-0 rounded-xl blur-2xl z-0"
        animate={{
          opacity: isRunning ? 1 : 0,
          scale: isRunning ? 1.8 : 1.2,
        }}
        transition={{ duration: 0.5 }}
        style={{ background: c.bg }}
      />
      
      {/* Hover ambient glow */}
      <div
        className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-150 z-0"
        style={{ background: c.bg }}
      />

      {/* Node body */}
      <motion.div
        className="relative z-10 rounded-xl px-4 py-2.5 min-w-[150px] backdrop-blur-xl border shadow-xl"
        animate={{
          scale: isRunning ? 1.05 : 1,
          borderColor: isRunning ? c.accent : isCompleted ? "rgba(255,255,255,0.15)" : c.border,
          boxShadow: isRunning ? `0 0 30px -5px ${c.bg}` : "0 0 0px 0px transparent",
          background: isRunning ? "rgba(10,10,20,0.95)" : "rgba(8,8,16,0.85)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="relative flex items-center justify-center w-3 h-3">
            {!isCompleted ? (
              <>
                <div
                  className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                  style={{ background: sc }}
                />
                {isRunning && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: sc }}
                    animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </>
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <CheckCircle2
                  className="w-3.5 h-3.5"
                  style={{ color: sc }}
                />
              </motion.div>
            )}
          </div>

          {/* Icon */}
          <node.icon
            className="w-4 h-4 transition-colors duration-300"
            style={{ color: isRunning ? c.accent : isCompleted ? "#f1f5f9" : c.accent }}
          />

          {/* Label */}
          <span className="text-xs font-semibold text-white/90 whitespace-nowrap">
            {node.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-[2px] w-full rounded-full overflow-hidden bg-white/5 relative">
          <AnimatePresence>
            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${c.accent}, transparent)` }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {isCompleted && (
            <motion.div
              layoutId={`progress-${node.id}`}
              className="absolute inset-0 bg-emerald-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const PreviewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Sequence state: -1 (idle), 0..4 (steps)
  const [step, setStep] = useState(-1);
  const [logs, setLogs] = useState<{ id: string; text: string; color: string; time: string }[]>([]);

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (sectionRef.current && canvasRef.current) {
        ctx = gsap.context(() => {
          gsap.fromTo(
            canvasRef.current,
            { y: 80, opacity: 0, rotateX: 8 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
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

  // Workflow execution sequence controller
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const schedule = (nextStep: number, delayStr: string, delayMs: number) => {
      timeoutId = setTimeout(() => {
        setStep(nextStep);
        if (nextStep >= 0) {
          addLog(nextStep, delayStr);
        }
      }, delayMs);
    };

    // Define the sequence
    if (step === -1) schedule(0, "0.0s", 1500); // Start Trigger
    else if (step === 0) schedule(1, "0.1s", 1000); // Trigger -> GPT-4
    else if (step === 1) schedule(2, "2.4s", 2500); // GPT-4 -> Actions
    else if (step === 2) schedule(3, "0.3s", 1500); // Actions -> Notify
    else if (step === 3) schedule(4, "0.2s", 1200); // Notify -> Done
    else if (step === 4) schedule(-1, "—", 4000); // Done -> Reset after 4s

    return () => clearTimeout(timeoutId);
  }, [step]);

  const addLog = (s: number, time: string) => {
    const newLog = 
      s === 0 ? { id: "l0", text: "Webhook received", color: "#f59e0b", time } :
      s === 1 ? { id: "l1", text: "Processing via GPT-4...", color: "#8b5cf6", time } :
      s === 2 ? { id: "l2", text: "Writing to DB & Slack...", color: "#3b82f6", time } :
      s === 3 ? { id: "l3", text: "Sending Email Alert...", color: "#10b981", time } :
      { id: "l4", text: "Workflow completed successfully", color: "#10b981", time: "Total: 3.0s" };

    if (s === 0) setLogs([newLog]);
    else setLogs(prev => [...prev, newLog]);
  };

  const getStatus = (id: string): NodeStatus => {
    if (step === -1) return "pending";
    if (id === "trigger") return step === 0 ? "running" : step > 0 ? "completed" : "pending";
    if (id === "ai") return step === 1 ? "running" : step > 1 ? "completed" : "pending";
    if (id === "action" || id === "save") return step === 2 ? "running" : step > 2 ? "completed" : "pending";
    if (id === "notify") return step === 3 ? "running" : step > 3 ? "completed" : "pending";
    return "completed";
  };

  const activeNodeCount = step === -1 ? 0 : step === 4 ? 5 : step + 1;

  const getPath = (fromId: string, toId: string) => {
    const from = nodesDef.find((n) => n.id === fromId)!;
    const to = nodesDef.find((n) => n.id === toId)!;
    const cx = (from.x + to.x) / 2;
    return `M ${from.x} ${from.y} C ${cx} ${from.y}, ${cx} ${to.y}, ${to.x} ${to.y}`;
  };

  return (
    <section id="preview" ref={sectionRef} className="relative py-32 px-6">
      {/* Background glow for the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4 block">
          Live Execution
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Watch it work in real-time
        </h2>
        <p className="text-base text-slate-400 max-w-xl mx-auto font-medium">
          A truly creative visual workflow builder. See data flow and nodes execute automatically.
        </p>
      </div>

      {/* Preview container */}
      <div className="max-w-[1000px] mx-auto relative z-10" style={{ perspective: "1200px" }}>
        <div
          ref={canvasRef}
          className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)] bg-[#08080C]/80 backdrop-blur-2xl"
        >
          {/* ─── Fake toolbar ─── */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.06] bg-black/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-[#ff5f57] transition-colors" />
              <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-[#febc2e] transition-colors" />
              <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-[#28c840] transition-colors" />
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-1.5 shadow-inner hidden sm:flex">
                <span className="text-xs text-slate-400 font-mono">my-ai-workflow.flux</span>
                {step > -1 && step < 4 && (
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10">
                    <Loader2 className="w-3 h-3 animate-spin" /> saving...
                  </span>
                )}
              </div>
            </div>

            {/* Run Button Simulation */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-medium">v2.0 Beta</span>
              <motion.div
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-xl border transition-colors ${
                  step > -1 && step < 4
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}
                animate={step === -1 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: step === -1 ? Infinity : 0 }}
              >
                {step > -1 && step < 4 ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-emerald-400" />
                    Ready
                  </>
                )}
              </motion.div>
            </div>
          </div>

          {/* ─── Mini sidebar ─── */}
          <div className="absolute left-0 top-[56px] bottom-0 w-14 border-r border-white/[0.04] bg-black/20 flex flex-col items-center py-6 gap-4 z-20">
            {[Globe, Sparkles, Database, Send, Zap].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300 transition-all cursor-grab"
              >
                <Icon className="w-4 h-4 text-slate-500 transition-inherit" />
              </motion.div>
            ))}
          </div>

          {/* ─── Canvas area ─── */}
          <div className="relative ml-14 h-[500px] overflow-hidden">
            {/* Ambient animated grid specific to canvas */}
            <div
              className="absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* ─── SVG Connections ─── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="connActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {connections.map((conn) => {
                const isActive = step >= conn.activeAt;
                const pathD = getPath(conn.from, conn.to);
                return (
                  <g key={conn.id}>
                    {/* Background inactive path */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="0.4"
                    />
                    {/* Active highlighted path */}
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke="url(#connActive)"
                      strokeWidth="0.6"
                      filter="url(#glow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: isActive ? 1 : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    {/* Single glowing particle that fires exactly when connection activates */}
                    <AnimatePresence>
                      {isActive && step === conn.activeAt && (
                        <motion.circle
                          r="1.2"
                          fill="#fff"
                          filter="url(#glow)"
                          initial={{ offsetDistance: "0%", opacity: 0 }}
                          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, ease: "linear" }}
                          style={{ offsetPath: `path('${pathD}')` } as any}
                        />
                      )}
                    </AnimatePresence>
                  </g>
                );
              })}
            </svg>

            {/* ─── Nodes ─── */}
            {nodesDef.map((node, i) => (
              <FakeNode
                key={node.id}
                node={node}
                status={getStatus(node.id)}
                delay={0.4 + i * 0.15}
              />
            ))}

            {/* ─── Execution log panel ─── */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6, type: "spring" }}
              className="absolute bottom-6 left-6 w-[260px] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl bg-[#030305]/95 backdrop-blur-3xl z-30"
            >
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/80 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    {step > -1 && step < 4 && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    )}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Execution
                </div>
                <span className="text-[10px] font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {activeNodeCount}/5 nodes
                </span>
              </div>
              <div className="p-3 space-y-2 h-[140px] overflow-hidden flex flex-col justify-end">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex items-center justify-between text-[11px] bg-white/[0.03] border border-white/[0.04] p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                          style={{ background: log.color, color: log.color }}
                        />
                        <span className="text-slate-300 font-medium">{log.text}</span>
                      </div>
                      <span className="text-slate-500 font-mono">{log.time}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {logs.length === 0 && (
                  <div className="text-center text-xs text-slate-600 pb-2">Waiting to trigger...</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
