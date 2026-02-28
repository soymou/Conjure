"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Scale } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/leyes", label: "Leyes" },
  { href: "/jurisprudencia", label: "Jurisprudencia" },
  { href: "/articulos", label: "Artículos" },
];

export function Header() {
  const { open, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="border-gradient sticky top-0 z-50 flex h-12 items-center gap-3 border-b border-border/50 bg-bg/70 px-4 backdrop-blur-xl">
      <button
        onClick={toggle}
        className="focus-ring rounded-md p-1.5 text-fg-4 transition-colors hover:bg-surface-2 hover:text-fg-3"
        aria-label="Toggle sidebar"
      >
        {open ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeftOpen className="h-4 w-4" />
        )}
      </button>

      <Link
        href="/"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
          <Scale className="h-3 w-3 text-accent" />
        </div>
        <span className="text-[13px] font-bold tracking-tight text-fg">
          Conjure
        </span>
      </Link>

      <div className="mx-2 h-4 w-px bg-border" />

      <nav className="hidden items-center gap-0.5 sm:flex">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "focus-ring rounded-md px-3 py-1.5 text-[12px] font-medium transition-all duration-200",
              pathname.startsWith(href)
                ? "bg-accent/10 text-accent"
                : "text-fg-4 hover:bg-surface-2 hover:text-fg-3"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      <a
        href="https://ordina-engine.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-border/60 px-3 py-1 text-[11px] font-medium text-fg-4 transition-all hover:border-accent/30 hover:text-accent"
      >
        API ↗
      </a>
    </header>
  );
}
