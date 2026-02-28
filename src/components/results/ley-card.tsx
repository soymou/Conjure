import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Ley } from "@/types/api";

export function LeyCard({ ley }: { ley: Ley }) {
  return (
    <Link
      href={`/articulos?cat=${ley.categoria}&ley=${ley.id}&nombre=${encodeURIComponent(ley.nombre)}`}
      className="card-glow group flex items-start gap-3 rounded-xl border border-border/60 bg-surface/60 px-4 py-3.5 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-fg-3 transition-colors group-hover:text-fg">
          {ley.nombre}
        </p>
        <div className="mt-2.5 flex gap-1.5">
          <Badge variant="highlight">{ley.id}</Badge>
          <Badge>cat {ley.categoria}</Badge>
        </div>
      </div>
      <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-fg-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
    </Link>
  );
}
