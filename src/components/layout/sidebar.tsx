"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Scale, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

const links = [
  { href: "/leyes", label: "Leyes", icon: BookOpen },
  { href: "/jurisprudencia", label: "Jurisprudencia", icon: Scale },
  { href: "/articulos", label: "Artículos", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-border/50 bg-bg/50 transition-all duration-200",
        open ? "w-48" : "w-0 overflow-hidden border-r-0"
      )}
    >
      <nav className="flex flex-col gap-1 p-3 pt-4">
        <p className="mb-2 px-2 text-2xs font-semibold uppercase tracking-[0.15em] text-fg-4/60">
          Consultar
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-all duration-200",
                active
                  ? "bg-accent/10 text-accent shadow-sm"
                  : "text-fg-3 hover:bg-surface-2 hover:text-fg-2"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", active ? "text-accent" : "text-fg-4")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 my-2 border-t border-border/40" />

      <a
        href="https://ordina-engine.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-3 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] text-fg-4 transition-all hover:bg-surface-2 hover:text-fg-3"
      >
        <ExternalLink className="h-3 w-3" />
        API Docs
      </a>
    </aside>
  );
}
