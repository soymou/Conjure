"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchJurisprudenciaDetalle } from "@/lib/api";
import { useJurisprudenciaCompare } from "@/hooks/use-jurisprudencia-compare";
import { sanitizeHtml } from "@/lib/utils";

function fmtDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-2xs uppercase tracking-wide text-fg-4/80">{label}</p>
      <p className="text-[12px] leading-relaxed text-fg-3">{value || "—"}</p>
    </div>
  );
}

export default function JurisprudenciaCompararPage() {
  const compare = useJurisprudenciaCompare();
  const selected = compare.getAll();

  const detailQueries = useQueries({
    queries: selected.map((item) => ({
      queryKey: ["jurisprudencia-detalle", item.ius],
      queryFn: () => fetchJurisprudenciaDetalle(item.ius),
      staleTime: 5 * 60_000,
    })),
  });

  const detailMap = useMemo(() => {
    const map = new Map<number, string>();
    selected.forEach((item, idx) => {
      const detail = detailQueries[idx]?.data;
      if (detail?.texto) {
        map.set(item.ius, detail.texto);
      }
    });
    return map;
  }, [detailQueries, selected]);

  if (selected.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link
          href="/jurisprudencia"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-2xs text-fg-4 transition-all hover:bg-surface-2 hover:text-fg-3"
        >
          <ArrowLeft className="h-3 w-3" />
          volver a resultados
        </Link>
        <EmptyState
          title="Sin tesis seleccionadas"
          description="Selecciona al menos 2 tesis en resultados para comparar."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/jurisprudencia"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-2xs text-fg-4 transition-all hover:bg-surface-2 hover:text-fg-3"
        >
          <ArrowLeft className="h-3 w-3" />
          volver a resultados
        </Link>
        <button
          onClick={compare.clear}
          className="focus-ring inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
        >
          <Trash2 className="h-3 w-3" />
          limpiar selección
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <h1 className="text-[16px] font-semibold text-fg">Comparador de jurisprudencia</h1>
        <p className="text-2xs text-fg-4">{selected.length} tesis seleccionadas</p>
      </div>

      {selected.length < 2 && (
        <p className="rounded-lg border border-border/60 bg-surface/60 px-3 py-2 text-2xs text-fg-4">
          Selecciona al menos 2 tesis para una comparación útil.
        </p>
      )}

      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {selected.map((item, idx) => {
          const detailLoading = detailQueries[idx]?.isLoading;
          const detailText = detailMap.get(item.ius) || item.textoSnippet;

          return (
            <article key={item.ius} className="rounded-xl border border-border/60 bg-surface/60 p-4 shadow-card backdrop-blur-sm">
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug text-fg-2">{item.rubro}</p>
                <button
                  onClick={() => compare.remove(item.ius)}
                  className="focus-ring inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
                >
                  <X className="h-3 w-3" />
                  quitar
                </button>
              </div>

              <div className="space-y-3">
                <Field label="IUS" value={item.ius} />
                <Field label="Fecha de publicación" value={fmtDate(item.fechaPublicacion)} />
                <Field label="Instancia" value={item.instancia} />
                <Field label="Época" value={item.epoca} />
                <Field label="Tipo de documento" value={item.tipoDocumento} />
                <div className="space-y-1">
                  <p className="text-2xs uppercase tracking-wide text-fg-4/80">Texto (snippet)</p>
                  <div
                    className="rounded-lg border border-border/50 bg-surface-2/40 p-2 text-[11px] leading-relaxed text-fg-3"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.textoSnippet || "—") }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-2xs uppercase tracking-wide text-fg-4/80">Texto del detalle</p>
                  <div
                    className="max-h-64 overflow-auto rounded-lg border border-border/50 bg-surface-2/40 p-2 text-[11px] leading-relaxed text-fg-3"
                    dangerouslySetInnerHTML={{
                      __html: detailLoading ? "Cargando detalle…" : sanitizeHtml(detailText || "Sin contenido."),
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 border-t border-border/50 pt-2">
                <Link href={`/jurisprudencia/${item.ius}`} className="text-2xs text-accent hover:underline">
                  Ver detalle completo
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
