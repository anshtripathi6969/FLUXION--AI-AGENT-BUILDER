"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Heart, ExternalLink, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Workflows Built" },
  { value: "500K+", label: "Nodes Executed" },
  { value: "50ms", label: "Avg Latency" },
  { value: "99.9%", label: "Uptime" },
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Live Preview", href: "#preview" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: "https://github.com/anshtripathi6969/FLUXION--AI-AGENT-BUILDER", external: true },
      { label: "Documentation", href: null, comingSoon: true },
    ],
  },
];

export const CTAFooter = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (ctaRef.current) {
        ctx = gsap.context(() => {
          gsap.fromTo(
            ctaRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 80%",
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

  return (
    <>
      {/* ─── CTA Section ─── */}
      <section className="relative py-24 px-6">
        {/* Section header — matching other sections */}
        <div className="max-w-7xl mx-auto mb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent-text)] mb-4 block">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--landing-text-primary)] mb-4">
            Ready to automate your workflows?
          </h2>
          <p className="text-base text-[var(--landing-text-secondary)] max-w-xl mx-auto font-medium">
            Join thousands of teams building smarter automations with Fluxion.
          </p>
        </div>

        <div ref={ctaRef} className="max-w-5xl mx-auto">
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-5 rounded-xl bg-[#0c0c10] border border-[#1a1a22]"
              >
                <div className="text-2xl sm:text-3xl font-[800] text-[var(--landing-text-primary)] tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--landing-text-tertiary)] font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA card — solid */}
          <div className="rounded-2xl bg-[#0c0c10] border border-[#1a1a22]">
            <div className="px-8 py-14 sm:px-16 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--landing-text-primary)] mb-2">
                  Start building for free
                </h3>
                <p className="text-sm text-[var(--landing-text-secondary)] max-w-sm font-medium">
                  No credit card required. Deploy your first workflow in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/signup"
                  className="group px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-[var(--landing-accent)] hover:bg-[var(--landing-accent-hover)] transition-colors duration-300"
                >
                  Get Started
                  <ArrowRight className="inline-block w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="https://github.com/anshtripathi6969/FLUXION--AI-AGENT-BUILDER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] bg-[#111116] hover:bg-[#16161c] transition-colors duration-300"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#1a1a22] py-10 px-6 bg-[#08080c]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Logo + description column */}
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <Image src="/logos/logo2.svg" alt="Fluxion" width={28} height={28} />
                <span className="text-xl font-bold text-[var(--landing-text-primary)] tracking-tight">
                  Fluxion
                </span>
              </Link>
              <p className="text-sm text-[var(--landing-text-tertiary)] leading-relaxed mb-6 max-w-[240px]">
                The visual AI workflow builder for modern teams. Automate anything.
              </p>
              {/* GitHub star button */}
              <a
                href="https://github.com/anshtripathi6969/FLUXION--AI-AGENT-BUILDER"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111116] border border-[#1a1a22] text-sm font-medium text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)] hover:border-[#262630] transition-all duration-300"
              >
                <Star className="w-3.5 h-3.5 text-[#f59e0b]" />
                Star on GitHub
              </a>
            </div>

            {/* Link columns */}
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--landing-text-secondary)] mb-5">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {"comingSoon" in link && link.comingSoon ? (
                        <span
                          className="text-sm text-[var(--landing-text-tertiary)] inline-flex items-center gap-1.5 cursor-default"
                          aria-disabled="true"
                        >
                          {link.label}
                          <span className="text-[10px] text-[var(--landing-text-tertiary)] opacity-60">
                            Coming Soon
                          </span>
                        </span>
                      ) : (
                        <a
                          href={link.href ?? undefined}
                          {...("external" in link && link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-sm text-[var(--landing-text-tertiary)] hover:text-[var(--landing-text-primary)] transition-colors duration-300 inline-flex items-center gap-1.5"
                        >
                          {link.label}
                          {"external" in link && link.external && (
                            <ExternalLink className="w-3 h-3" />
                          )}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Creator column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--landing-text-secondary)] mb-5">
                Creator
              </h4>
              <a
                href="https://github.com/anshtripathi6969"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group mb-4"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--landing-text-primary)] group-hover:text-white transition-colors">
                    Ansh Tripathi
                  </span>
                  <span className="text-[11px] text-[var(--landing-text-tertiary)]">
                    Creator & Developer
                  </span>
                </div>
              </a>
              <a
                href="https://github.com/anshtripathi6969"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--landing-text-tertiary)] hover:text-[var(--landing-text-primary)] transition-colors duration-300"
              >
                <Github className="w-4 h-4" />
                @anshtripathi6969
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
