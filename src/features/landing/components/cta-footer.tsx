"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Preview", href: "#preview" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
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
      <section className="relative py-32 px-6">
        <div
          ref={ctaRef}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-white/5"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-indigo-600/10" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="relative z-10 px-8 py-20 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Start building your first AI workflow
            </h2>
            <p className="text-base text-slate-400 max-w-lg mx-auto mb-8 font-medium">
              Join thousands of teams already automating their work with Fluxion.
              Free to start, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group relative px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)]"
              >
                Get Started — Free
                <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {/* Logo column */}
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <Image src="/logos/logo2.svg" alt="Fluxion" width={24} height={24} />
                <span className="text-lg font-bold text-white tracking-tight">
                  Fluxion
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                Build powerful AI automations with a visual workflow builder.
              </p>
            </div>

            {/* Link columns */}
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-white transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-600">
              © {new Date().getFullYear()} Fluxion. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-xs text-slate-600 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
