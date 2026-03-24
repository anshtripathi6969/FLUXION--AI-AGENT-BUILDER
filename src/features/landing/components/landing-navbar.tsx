"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Preview", href: "#preview" },
];

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#030305]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logos/logo2.svg"
              alt="Fluxion"
              width={28}
              height={28}
              className="relative z-10"
            />
            <span className="absolute inset-0 rounded-full blur-lg bg-blue-500/30 group-hover:bg-violet-500/50 transition-colors duration-500" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Fluxion
          </span>
        </Link>

        {/* Nav Links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-300 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors duration-300 font-medium hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
};
