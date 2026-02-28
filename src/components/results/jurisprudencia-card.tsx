import { Badge } from "@/components/ui/badge";
import type { JurisprudenciaItem } from "@/types/api";

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

export function JurisprudenciaCard({ item }: { item: JurisprudenciaItem }) {
  return (
    <div className="card-glow rounded-xl border border-border/60 bg-surface/60 px-4 py-3.5 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover hover:-translate-y-0.5">
      <p className="text-[13px] font-medium leading-snug text-fg-3 transition-colors">
        {item.rubro}
      </p>

      {item.textoSnippet && (
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-fg-4">
          {item.textoSnippet}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="highlight">{item.ius}</Badge>
        {item.isSemanal && <Badge>semanal</Badge>}
        {item.fechaPublicacion && (
          <span className="text-2xs text-fg-4/50">
            {fmtDate(item.fechaPublicacion)}
          </span>
        )}
      </div>
    </div>
  );
}
