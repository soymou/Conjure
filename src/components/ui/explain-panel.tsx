"use client";

import { AlertTriangle, Download, Loader2, MessageSquareQuote, Sparkles, Trash2 } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { useAiExplain, type ExplainMode } from "@/hooks/use-ai-explain";
import { sanitizeHtml } from "@/lib/utils";

interface ExplainPanelProps {
  text: string;
  helper?: ReactNode;
}

function renderMarkdown(md: string) {
  const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = escaped.split(/\r?\n/);
  let html = "";
  let inList = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-1">';
        inList = true;
      }
      html += `<li>${bullet[1]}</li>`;
      continue;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }
    html += `<p>${line}</p>`;
  }

  if (inList) html += "</ul>";

  return sanitizeHtml(
    html
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-bg/20 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-fg-4">{title}</p>
      <ul className="space-y-1.5 text-[13px] text-fg-2">
        {items.map((item, idx) => (
          <li key={`${title}-${idx}`} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent/80" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const MODES: Array<{ key: ExplainMode; label: string }> = [
  { key: "claro", label: "Claro" },
  { key: "tecnico", label: "Técnico" },
  { key: "cliente", label: "Cliente" },
];

const DRAFT_PRESETS = [
  "Genera un borrador de agravios basado en esta tesis.",
  "Redacta conceptos de violación usando esta tesis como fundamento.",
  "Dame argumentos a favor y en contra para litigar con esta tesis.",
];

export function ExplainPanel({ text, helper }: ExplainPanelProps) {
  const { explain, ask, clearHistory, status, summary, structured, answer, answerCitations, qaHistory, error } = useAiExplain();
  const [mode, setMode] = useState<ExplainMode>("claro");
  const [question, setQuestion] = useState("");
  const canExplain = Boolean(text?.trim());

  const buttonLabel = useMemo(() => {
    if (status === "loading") return "Procesando…";
    if (summary) return "Regenerar análisis";
    return "Generar análisis IA";
  }, [status, summary]);

  const exportAnalysis = () => {
    const report = [
      "# Reporte IA - Jurisprudencia",
      `Modo: ${mode}`,
      "",
      "## Resumen ejecutivo",
      structured?.executive || summary || "(sin resumen)",
      "",
      "## Puntos clave",
      ...(structured?.keyPoints || []).map((x) => `- ${x}`),
      "",
      "## Qué favorece",
      ...(structured?.favors || []).map((x) => `- ${x}`),
      "",
      "## Límites",
      ...(structured?.limits || []).map((x) => `- ${x}`),
      "",
      "## Riesgos",
      ...(structured?.risks || []).map((x) => `- ${x}`),
      "",
      "## Recomendación",
      structured?.recommendation || "",
      "",
      "## Historial Q&A",
      ...qaHistory.flatMap((item, idx) => [
        `### ${idx + 1}. ${item.question}`,
        item.answer,
        ...(item.citations || []).map((c) => `> "${c.quote}"`),
        "",
      ]),
    ].join("\n");

    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte-ia-jurisprudencia.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-xl border border-border/60 bg-surface/60 p-4 shadow-card backdrop-blur-sm space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-fg">Copiloto jurídico IA</p>
            <p className="text-2xs text-fg-4">Resumen ejecutivo, riesgos, recomendación y Q&A contextual con citas.</p>
          </div>
          <button
            disabled={!canExplain || status === "loading"}
            onClick={() => explain(text, mode)}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent transition-all hover:bg-accent/20 disabled:pointer-events-none disabled:opacity-50"
          >
            {status === "loading" && <Loader2 className="h-3 w-3 animate-spin" />}
            <Sparkles className="h-3.5 w-3.5" />
            {buttonLabel}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-lg border border-border/60 bg-bg/20 p-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`rounded-md px-2.5 py-1 text-[11px] transition ${mode === m.key ? "bg-accent/20 text-accent" : "text-fg-4 hover:text-fg-2"}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={exportAnalysis}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-bg/20 px-2.5 py-1 text-[11px] text-fg-3 hover:text-fg"
          >
            <Download className="h-3.5 w-3.5" /> Exportar reporte
          </button>
        </div>

        {helper && <div className="text-2xs text-fg-4">{helper}</div>}
      </div>

      {!summary && status === "idle" && <p className="text-2xs text-fg-4">Genera un análisis completo o haz preguntas puntuales sobre esta tesis.</p>}

      {status === "error" && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-2xs text-red-300/90">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <p>{error || "No se pudo completar la solicitud."}</p>
          </div>
        </div>
      )}

      {summary && structured && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border/60 bg-bg/10 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-fg-4">Resumen ejecutivo</p>
            <div className="prose prose-invert max-w-none text-[13px] leading-relaxed prose-p:my-1" dangerouslySetInnerHTML={{ __html: renderMarkdown(structured.executive || summary) }} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Block title="Puntos clave" items={structured.keyPoints} />
            <Block title="Qué favorece" items={structured.favors} />
            <Block title="Límites" items={structured.limits} />
            <Block title="Riesgos" items={structured.risks} />
          </div>

          {structured.recommendation && (
            <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">Siguiente paso sugerido</p>
              <p className="text-[13px] text-emerald-100/90">{structured.recommendation}</p>
            </div>
          )}

          {structured.citations.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-bg/10 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-fg-4">Citas del texto fuente</p>
              <div className="space-y-2">
                {structured.citations.map((c, idx) => (
                  <p key={`cite-${idx}`} className="text-[12px] text-fg-3 border-l-2 border-accent/40 pl-2 italic">“{c.quote}”</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-border/60 bg-bg/10 p-3 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-4">Preguntar sobre esta tesis</p>

        <div className="flex flex-wrap gap-1.5">
          {DRAFT_PRESETS.map((preset) => (
            <button
              key={preset}
              disabled={status === "loading" || !canExplain}
              onClick={() => ask(text, preset, mode)}
              className="rounded-md border border-border/70 bg-bg/30 px-2 py-1 text-[11px] text-fg-3 hover:text-fg disabled:pointer-events-none disabled:opacity-50"
            >
              {preset.replace("Genera ", "").replace("Redacta ", "").replace("Dame ", "")}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ej. ¿Esto aplica para despido injustificado en sector público?"
            className="w-full rounded-lg border border-border/70 bg-bg/30 px-3 py-2 text-[13px] text-fg outline-none focus:border-accent/50"
          />
          <button
            disabled={!question.trim() || status === "loading" || !canExplain}
            onClick={() => ask(text, question, mode)}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[12px] font-semibold text-accent transition hover:bg-accent/20 disabled:pointer-events-none disabled:opacity-50"
          >
            <MessageSquareQuote className="h-3.5 w-3.5" /> Preguntar
          </button>
        </div>

        {answer && (
          <div className="mt-1 space-y-2">
            <div className="rounded-lg border border-border/60 bg-bg/20 p-3 text-[13px] text-fg-2 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(answer) }} />
            </div>
            {answerCitations.length > 0 && (
              <div className="space-y-1">
                {answerCitations.map((c, idx) => (
                  <p key={`a-cite-${idx}`} className="text-[12px] text-fg-3 border-l-2 border-accent/40 pl-2 italic">“{c.quote}”</p>
                ))}
              </div>
            )}
          </div>
        )}

        {qaHistory.length > 0 && (
          <div className="mt-3 space-y-2 rounded-lg border border-border/60 bg-bg/20 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-fg-4">Historial reciente</p>
              <button onClick={clearHistory} className="inline-flex items-center gap-1 text-[11px] text-fg-4 hover:text-fg-2">
                <Trash2 className="h-3 w-3" /> Limpiar
              </button>
            </div>
            <div className="space-y-2">
              {qaHistory.map((item, idx) => (
                <div key={`${item.createdAt}-${idx}`} className="rounded-md border border-border/60 bg-bg/30 p-2">
                  <p className="text-[12px] font-medium text-fg">Q: {item.question}</p>
                  <p className="mt-1 text-[12px] text-fg-3 line-clamp-3">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {status === "loading" && <p className="text-2xs text-fg-4">Procesando solicitud en Hugging Face…</p>}
    </section>
  );
}
