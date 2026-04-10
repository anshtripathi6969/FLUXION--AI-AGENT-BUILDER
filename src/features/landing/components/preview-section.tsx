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
  { id: "trigger", label: "HTTP Trigger", icon: Globe, type: "trigger" as const, x: 16, y: 22 },
  { id: "ai", label: "GPT-4 Process", icon: Sparkles, type: "ai" as const, x: 40, y: 50 },
  { id: "action", label: "Send to Slack", icon: Send, type: "action" as const, x: 68, y: 22 },
  { id: "save", label: "Save to DB", icon: Database, type: "output" as const, x: 68, y: 75 },
  { id: "notify", label: "Email Alert", icon: Zap, type: "action" as const, x: 82, y: 50 },
];

/* Brighter, more vivid colors */
const nodeColors = {
  trigger: { accent: "#fbbf24", bg: "#1a1608", border: "#3d3010" },
  ai:      { accent: "#c084fc", bg: "#160e22", border: "#2e1e46" },
  action:  { accent: "#60a5fa", bg: "#0c1420", border: "#1a2840" },
  output:  { accent: "#4ade80", bg: "#0c1a10", border: "#183020" },
};

const connections = [
  { id: "c1", from: "trigger", to: "ai", activeAt: 1, color: "#c084fc" },
  { id: "c2", from: "ai", to: "action", activeAt: 2, color: "#60a5fa" },
  { id: "c3", from: "ai", to: "save", activeAt: 2, color: "#4ade80" },
  { id: "c4", from: "action", to: "notify", activeAt: 3, color: "#60a5fa" },
];

const sidebarItems = [
  { id: "globe", icon: Globe, color: "#fbbf24" },
  { id: "sparkles", icon: Sparkles, color: "#c084fc" },
  { id: "database", icon: Database, color: "#4ade80" },
  { id: "send", icon: Send, color: "#60a5fa" },
  { id: "zap", icon: Zap, color: "#fb7185" },
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
  const c = nodeColors[node.type];
  const isRunning = status === "running";
  const isCompleted = status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="absolute cursor-default"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 15,
      }}
    >
      {/* Solid node — sits ABOVE connection lines */}
      <motion.div
        className="rounded-xl px-4 py-2.5 min-w-[130px] border"
        animate={{ scale: isRunning ? 1.04 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: isRunning ? c.bg : "#0c0c10",
          borderColor: isRunning ? c.accent : isCompleted ? "#1a3022" : c.border,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-3.5 h-3.5">
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
              </motion.div>
            ) : (
              <>
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: c.accent, opacity: isRunning ? 1 : 0.5 }}
                />
                {isRunning && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: c.accent }}
                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </>
            )}
          </div>

          <node.icon
            className="w-4 h-4"
            style={{ color: c.accent, opacity: isRunning || isCompleted ? 1 : 0.7 }}
          />

          <span className="text-xs font-semibold text-[#e4e4eb] whitespace-nowrap">
            {node.label}
          </span>
        </div>

        <div className="mt-2 h-[2px] w-full rounded-full overflow-hidden" style={{ background: c.border }}>
          {isRunning && (
            <motion.div
              className="h-full rounded-full"
              style={{ background: c.accent }}
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          {isCompleted && (
            <motion.div
              className="h-full rounded-full bg-[#4ade80]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.3 }}
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
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const schedule = (nextStep: number, delayStr: string, delayMs: number) => {
      timeoutId = setTimeout(() => {
        setStep(nextStep);
        if (nextStep >= 0) addLog(nextStep, delayStr);
      }, delayMs);
    };

    if (step === -1) schedule(0, "0.0s", 1500);
    else if (step === 0) schedule(1, "0.1s", 1000);
    else if (step === 1) schedule(2, "2.4s", 2500);
    else if (step === 2) schedule(3, "0.3s", 1500);
    else if (step === 3) schedule(4, "0.2s", 1200);
    else if (step === 4) schedule(-1, "—", 4000);

    return () => clearTimeout(timeoutId);
  }, [step]);

  const addLog = (s: number, time: string) => {
    const newLog =
      s === 0 ? { id: "l0", text: "Webhook received", color: "#fbbf24", time } :
      s === 1 ? { id: "l1", text: "Processing via GPT-4...", color: "#c084fc", time } :
      s === 2 ? { id: "l2", text: "Writing to DB & Slack...", color: "#60a5fa", time } :
      s === 3 ? { id: "l3", text: "Sending Email Alert...", color: "#4ade80", time } :
      { id: "l4", text: "Workflow completed ✓", color: "#4ade80", time: "3.0s" };

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
    const midX = from.x + (to.x - from.x) * 0.5;
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  };

  return (
    <section id="preview" ref={sectionRef} className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto mb-14 text-center relative z-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent-text)] mb-4 block">
          Live Preview
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--landing-text-primary)] mb-4">
          Watch it work in real-time
        </h2>
        <p className="text-base text-[var(--landing-text-secondary)] max-w-xl mx-auto font-medium">
          A visual workflow builder that shows data flow and node execution live.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto relative z-10">
        <div
          ref={canvasRef}
          className="relative rounded-2xl overflow-hidden border border-[#1a1a22] bg-[#0a0a0e]"
        >
          {/* ─── Toolbar ─── */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-[#1a1a22] bg-[#08080c]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 bg-[#0e0e14] rounded-lg px-4 py-1.5 hidden sm:flex">
                <span className="text-xs text-[#4a4a5a] font-mono">my-ai-workflow.flux</span>
                {step > -1 && step < 4 && (
                  <span className="flex items-center gap-1.5 text-[10px] text-[#4ade80] font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" /> saving
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#4a4a5a] font-medium">v2.0</span>
              <div
                className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-lg"
                style={{
                  backgroundColor: step > -1 && step < 4 ? "#160e22" : "#0c1a10",
                  color: step > -1 && step < 4 ? "#c084fc" : "#4ade80",
                }}
              >
                {step > -1 && step < 4 ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-[#c084fc] animate-pulse" />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-[#4ade80]" />
                    Ready
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="absolute left-0 top-[56px] bottom-0 w-14 border-r border-[#1a1a22] bg-[#08080c] flex flex-col items-center py-6 gap-4 z-20">
            {sidebarItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="w-9 h-9 rounded-lg border border-[#1a1a22] bg-[#0e0e14] flex items-center justify-center hover:bg-[#111116] transition-all cursor-grab"
              >
                <item.icon className="w-4 h-4" style={{ color: item.color, opacity: 0.7 }} />
              </motion.div>
            ))}
          </div>

          {/* ─── Canvas area ─── */}
          <div className="relative ml-14 h-[480px] overflow-hidden bg-[#0a0a0e]">
            {/* Dotted bg */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, #222230 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* SVG Connections — z-index 10, nodes are z-index 15 so they cover endpoints */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 10 }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              role="presentation"
              focusable="false"
            >
              {connections.map((conn) => {
                const isActive = step >= conn.activeAt;
                const pathD = getPath(conn.from, conn.to);

                return (
                  <g key={conn.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={conn.color}
                      strokeWidth="0.3"
                      opacity="0.12"
                    />
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke={conn.color}
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: isActive ? 1 : 0,
                        opacity: isActive ? 0.85 : 0,
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes — z-index 15, cover the connection line endpoints */}
            {nodesDef.map((node, i) => (
              <FakeNode
                key={node.id}
                node={node}
                status={getStatus(node.id)}
                delay={0.3 + i * 0.1}
              />
            ))}

            {/* Log panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute bottom-5 left-5 w-[250px] rounded-xl border border-[#1a1a22] overflow-hidden bg-[#08080c]"
              style={{ zIndex: 20 }}
            >
              <div className="px-3.5 py-2.5 border-b border-[#1a1a22] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-[#7a7a8e] uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    {step > -1 && step < 4 && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c084fc] opacity-75" />
                    )}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c084fc]" />
                  </span>
                  Log
                </div>
                <span className="text-[10px] font-medium text-[#4a4a5a]">
                  {activeNodeCount}/5
                </span>
              </div>
              <div className="p-2.5 space-y-1.5 h-[130px] overflow-hidden flex flex-col justify-end">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between text-[10px] p-2 rounded-lg bg-[#0e0e14]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: log.color }} />
                        <span className="text-[#e4e4eb] font-medium">{log.text}</span>
                      </div>
                      <span className="text-[#4a4a5a] font-mono">{log.time}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {logs.length === 0 && (
                  <div className="text-center text-[10px] text-[#4a4a5a] pb-2">Waiting to trigger...</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
