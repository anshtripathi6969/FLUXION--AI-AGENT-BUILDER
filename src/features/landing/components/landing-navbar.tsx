"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Preview", href: "#preview" },
];

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "top-3 left-4 right-4 mx-auto max-w-5xl"
          : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled
            ? "bg-[#0c0c10] rounded-2xl px-5 h-14"
            : "max-w-7xl mx-auto px-6 h-16 bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logos/logo2.svg"
            alt="Fluxion"
            width={scrolled ? 24 : 28}
            height={scrolled ? 24 : 28}
            className="transition-all duration-300 group-hover:opacity-80"
          />
          <span className={`font-bold tracking-tight text-[var(--landing-text-primary)] transition-all duration-300 ${scrolled ? "text-base" : "text-lg"}`}>
            Fluxion
          </span>
        </Link>

        {/* Nav Links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-[13px] text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] transition-colors duration-300 font-medium py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] transition-colors duration-300 font-medium hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={`text-[13px] font-semibold text-white bg-[var(--landing-accent)] hover:bg-[var(--landing-accent-hover)] rounded-lg transition-all duration-300 ${scrolled ? "px-3.5 py-1.5" : "px-4 py-2"}`}
          >
            Get Started
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle main menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            className="md:hidden text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            id="mobile-nav-menu"
            className={`md:hidden mt-2 py-3 px-4 bg-[#0c0c10] rounded-xl ${scrolled ? "mx-0" : "mx-4"}`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] transition-colors font-medium sm:hidden"
            >
              Log in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
