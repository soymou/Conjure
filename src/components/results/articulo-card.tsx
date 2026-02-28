"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ArticuloItem } from "@/types/api";

export function ArticuloCard({ item }: { item: ArticuloItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`card-glow rounded-xl border bg-surface/60 shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover ${
        open ? "border-accent/20" : "border-border/60 hover:border-accent/30"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="highlight">Art. {item.numeroArticulo}</Badge>
          </div>
          {!open && item.textoPlano && (
            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-fg-4">
              {item.textoPlano}
            </p>
          )}
        </div>
        <ChevronRight
          className={`mt-0.5 h-3.5 w-3.5 shrink-0 transition-all duration-200 ${
            open ? "rotate-90 text-accent" : "text-fg-4"
          }`}
        />
      </button>

      {open && (
        <div className="animate-fade-in border-t border-border/40 px-4 py-4">
          <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-fg-3">
            {item.textoPlano || item.texto}
          </p>
        </div>
      )}
    </div>
  );
}
