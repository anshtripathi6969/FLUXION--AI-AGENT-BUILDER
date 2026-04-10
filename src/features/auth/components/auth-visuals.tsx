"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function AuthVisuals() {
  const [mounted] = useState(true);

  if (!mounted) return <div className="absolute inset-0 bg-[#060608]" />;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#060608]">
      {/* Dotted background — matching homepage */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #1a1a22 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
