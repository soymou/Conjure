"use client";

import Link from "next/link";
import { Star, Copy, ArrowRight, CheckSquare, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { useClipboard } from "@/hooks/use-clipboard";
import type { JurisprudenciaItem } from "@/types/api";
import { sanitizeHtml } from "@/lib/utils";

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function citation(item: JurisprudenciaItem) {
  return `${item.rubro}. IUS: ${item.ius}. ${item.instancia}, ${item.epoca}. Publicación: ${fmtDate(item.fechaPublicacion)}.`;
}

interface JurisprudenciaCardProps {
  item: JurisprudenciaItem;
  compareSelected?: boolean;
  onToggleCompare?: (item: JurisprudenciaItem) => void;
}

export function JurisprudenciaCard({ item, compareSelected = false, onToggleCompare }: JurisprudenciaCardProps) {
  const { toggle, check } = useFavorites();
  const { copy } = useClipboard();
  const favorite = check("jurisprudencia", item.ius);

  return (
    <div className="card-glow rounded-xl border border-border/60 bg-surface/60 px-4 py-3.5 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover hover:-translate-y-0.5">
      <p className="text-[13px] font-medium leading-snug text-fg-3 transition-colors">
        {item.rubro}
      </p>

      {item.textoSnippet && (
        <p
          className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-fg-4"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.textoSnippet) }}
        />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="highlight">{item.ius}</Badge>
        {item.isSemanal && <Badge>semanal</Badge>}
        {item.fechaPublicacion && (
          <span className="text-2xs text-fg-4/50">{fmtDate(item.fechaPublicacion)}</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {onToggleCompare && (
          <button
            onClick={() => onToggleCompare(item)}
            className="focus-ring inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
          >
            {compareSelected ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
            {compareSelected ? "quitar" : "seleccionar"}
          </button>
        )}
        <button
          onClick={() =>
            toggle({
              type: "jurisprudencia",
              id: item.ius,
              label: item.rubro,
              subtitle: item.instancia,
              data: item,
            })
          }
          className="focus-ring inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
        >
          <Star className={`h-3 w-3 ${favorite ? "fill-accent text-accent" : ""}`} />
          {favorite ? "favorito" : "guardar"}
        </button>
        <button
          onClick={() => copy(citation(item))}
          className="focus-ring inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
        >
          <Copy className="h-3 w-3" />
          citar
        </button>
        <Link
          href={`/jurisprudencia/${item.ius}`}
          className="focus-ring ml-auto inline-flex items-center gap-1 text-2xs text-accent hover:underline"
        >
          ver detalle <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
