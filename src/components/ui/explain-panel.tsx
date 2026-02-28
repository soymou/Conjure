"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { useAiExplain } from "@/hooks/use-ai-explain";

interface ExplainPanelProps {
  text: string;
  helper?: ReactNode;
}

export function ExplainPanel({ text, helper }: ExplainPanelProps) {
  const { explain, status, summary, error } = useAiExplain();
  const canExplain = Boolean(text?.trim());

  const buttonLabel = useMemo(() => {
    if (status === "loading") return "Generando…";
    if (summary) return "Regenerar";
    return "Generar explicación";
  }, [status, summary]);

  return (
    <section className="rounded-xl border border-border/60 bg-surface/60 p-4 shadow-card backdrop-blur-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">Explicación en lenguaje llano</p>
            <p className="text-2xs text-fg-4">Basado en el modelo gratuito <span className="font-mono">google/flan-t5-base</span> de Hugging Face.</p>
          </div>
          <button
            disabled={!canExplain || status === "loading"}
            onClick={() => explain(text)}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent transition-all duration-200 hover:bg-accent/20 disabled:pointer-events-none disabled:opacity-50"
          >
            {status === "loading" && <Loader2 className="h-3 w-3 animate-spin" />}
            {buttonLabel}
          </button>
        </div>
        {helper && <div className="text-2xs text-fg-4">{helper}</div>}
      </div>

      <div className="mt-4 space-y-3">
        {!summary && status === "idle" && (
          <p className="text-2xs text-fg-4">Haz clic para obtener un resumen amigable del texto completo de la tesis.</p>
        )}
        {status === "error" && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-2xs text-red-400/80">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <p>{error || "No se pudo generar la explicación."}</p>
            </div>
            <p className="mt-1 text-[10px] text-red-400/70">Revisa que el servidor tenga la clave de Hugging Face configurada y que no se haya superado la cuota gratuita.</p>
          </div>
        )}
        {summary && (
          <div className="rounded-xl border border-border/50 bg-bg/10 p-3 text-[13px] leading-relaxed text-fg">
            <p>{summary}</p>
          </div>
        )}
        {status === "loading" && (
          <p className="text-2xs text-fg-4">El modelo está procesando la solicitud. Esto puede tardar unos segundos dependiendo de la carga.</p>
        )}
      </div>
    </section>
  );
}
