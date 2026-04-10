"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Sparkles,
  Send,
  Database,
  ArrowRight,
  CheckCircle2,
  Zap,
  Mail,
} from "lucide-react";

/* ─── Circular workflow nodes (clockwise from top) ─── */
const workflowNodes = [
  { id: "trigger", label: "Webhook", icon: Globe, color: "#f59e0b" },     // 12 o'clock (top)
  { id: "notify", label: "Email", icon: Mail, color: "#06b6d4" },         // 2 o'clock (upper right)
  { id: "action", label: "Slack", icon: Send, color: "#3b82f6" },         // 4 o'clock (lower right)
  { id: "store", label: "Database", icon: Database, color: "#10b981" },   // 6 o'clock (bottom)
  { id: "logic", label: "Logic", icon: Zap, color: "#f43f5e" },           // 8 o'clock (lower left)
  { id: "process", label: "AI Model", icon: Sparkles, color: "#8b5cf6" }, // 10 o'clock (upper left)
];

type NodeStatus = "idle" | "active" | "done";

export const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let timeout: NodeJS.Timeout;

    if (activeIndex === -1) {
      timeout = setTimeout(() => setActiveIndex(0), 1500);
    } else if (activeIndex < workflowNodes.length) {
      timeout = setTimeout(() => setActiveIndex(activeIndex + 1), 900);
    } else {
      timeout = setTimeout(() => setActiveIndex(-1), 2500);
    }

    return () => clearTimeout(timeout);
  }, [activeIndex, mounted]);

  const getStatus = (i: number): NodeStatus => {
    if (activeIndex === -1) return "idle";
    if (i < activeIndex) return "done";
    if (i === activeIndex) return "active";
    return "idle";
  };

  const getNodePos = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const circleRadius = 180;
  const centerX = 220;
  const centerY = 220;


  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full py-20 pt-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* ── Left: Text content ── */}
          <div className="flex-1 max-w-2xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--landing-surface)] mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-[var(--landing-text-secondary)]">
                Now in public beta
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[900] tracking-[-0.04em] text-[var(--landing-text-primary)] leading-[1.08] mb-6"
            >
              Build AI workflows{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #7c5cfc 0%, #9869c7ff 33%,  #b3b60dff 66%, #f472b6 100%)",
                }}
              >
                visually.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base sm:text-lg text-[var(--landing-text-secondary)] max-w-md mb-10 leading-relaxed"
            >
              Drag nodes, wire APIs, plug in LLMs — and watch your automation
              execute in real-time. No code required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/signup"
                className="group px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-[var(--landing-accent)] hover:bg-[var(--landing-accent-hover)] transition-colors duration-300"
              >
                Start Building Free
                <ArrowRight className="inline-block w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#preview"
                className="px-7 py-3.5 rounded-xl text-[15px] font-semibold text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] bg-[var(--landing-surface)] hover:bg-[var(--landing-surface-hover)] transition-colors duration-300"
              >
                Watch Demo
              </a>
            </motion.div>
          </div>

          {/* ── Right: Circular Workflow Animation ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-shrink-0 relative hidden md:block"
            style={{ width: centerX * 2, height: centerY * 2 }}
          >
            {/* Center hub — Fluxion Logo */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: centerX - 32,
                top: centerY - 32,
                width: 64,
                height: 64,
              }}
            >
              <div className="w-16 h-16 rounded-full bg-[#060608] flex items-center justify-center">
                <Image
                  src="/logos/logo2.svg"
                  alt="Fluxion"
                  width={48}
                  height={48}
                />
              </div>
            </div>

            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${centerX * 2} ${centerY * 2}`}
              aria-hidden="true"
              focusable="false"
            >
              <circle
                cx={centerX}
                cy={centerY}
                r={circleRadius}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />

              {workflowNodes.map((node, i) => {
                const pos = getNodePos(i, workflowNodes.length, circleRadius);
                return (
                  <line
                    key={`spoke-${node.id}`}
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + pos.x}
                    y2={centerY + pos.y}
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {workflowNodes.map((node, i) => {
                const isActive =
                  getStatus(i) === "done" || getStatus(i) === "active";
                const startAngle = (i / workflowNodes.length) * 360 - 90;
                const endAngle =
                  ((i + 1) / workflowNodes.length) * 360 - 90;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = centerX + circleRadius * Math.cos(startRad);
                const y1 = centerY + circleRadius * Math.sin(startRad);
                const x2 = centerX + circleRadius * Math.cos(endRad);
                const y2 = centerY + circleRadius * Math.sin(endRad);

                return (
                  <motion.path
                    key={`arc-${node.id}`}
                    d={`M ${x1} ${y1} A ${circleRadius} ${circleRadius} 0 0 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={isActive ? workflowNodes[i].color : "transparent"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isActive ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                );
              })}

              {activeIndex >= 0 && activeIndex < workflowNodes.length && (
                <motion.circle
                  r="5"
                  fill={
                    workflowNodes[
                      Math.min(activeIndex, workflowNodes.length - 1)
                    ].color
                  }
                  initial={false}
                  animate={{
                    cx:
                      centerX +
                      getNodePos(activeIndex, workflowNodes.length, circleRadius).x,
                    cy:
                      centerY +
                      getNodePos(activeIndex, workflowNodes.length, circleRadius).y,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              )}
            </svg>

            {/* Nodes around the circle */}
            {workflowNodes.map((node, i) => {
              const pos = getNodePos(i, workflowNodes.length, circleRadius);
              const status = getStatus(i);
              const isActive = status === "active";
              const isDone = status === "done";

              // Determine label placement based on angle around the circle
              const angle = (i / workflowNodes.length) * 360 - 90;
              const normalizedAngle = ((angle % 360) + 360) % 360;
              // 0=top, 90=right, 180=bottom, 270=left
              let labelStyle: React.CSSProperties = {};
              if (normalizedAngle > 330 || normalizedAngle < 30) {
                // Top — label above
                labelStyle = { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 10 };
              } else if (normalizedAngle >= 30 && normalizedAngle < 150) {
                // Right side — label to the right
                labelStyle = { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 10 };
              } else if (normalizedAngle >= 150 && normalizedAngle < 210) {
                // Bottom — label below
                labelStyle = { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8 };
              } else {
                // Left side — label to the left
                labelStyle = { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 10 };
              }

              return (
                <motion.div
                  key={node.id}
                  className="absolute"
                  style={{
                    left: centerX + pos.x - 28,
                    top: centerY + pos.y - 28,
                    width: 56,
                    height: 56,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                >
                  {/* Circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-400"
                    style={{
                      backgroundColor: isActive
                        ? `color-mix(in srgb, ${node.color} 15%, #0c0c10)`
                        : isDone
                          ? `color-mix(in srgb, ${node.color} 8%, #0c0c10)`
                          : "#0c0c10",
                      border: `2px solid ${isActive
                        ? node.color
                        : isDone
                          ? `color-mix(in srgb, ${node.color} 30%, #0c0c10)`
                          : "#1a1a22"
                        }`,
                    }}
                  >
                    {isDone ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                      >
                        <CheckCircle2
                          className="w-6 h-6"
                          style={{ color: node.color }}
                        />
                      </motion.div>
                    ) : (
                      <node.icon
                        className="w-6 h-6 transition-colors duration-300"
                        style={{
                          color: isActive
                            ? node.color
                            : "var(--landing-text-secondary)",
                        }}
                      />
                    )}
                  </div>

                  {/* Label — positioned based on angle */}
                  <span
                    className="absolute text-[11px] font-semibold whitespace-nowrap transition-colors duration-300"
                    style={{
                      color:
                        isActive || isDone
                          ? "var(--landing-text-primary)"
                          : "var(--landing-text-tertiary)",
                      ...labelStyle,
                    }}
                  >
                    {node.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Outer decorative ring */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" focusable="false">
              <circle
                cx={centerX}
                cy={centerY}
                r={circleRadius + 36}
                fill="none"
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="1"
                strokeDasharray="3 8"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
