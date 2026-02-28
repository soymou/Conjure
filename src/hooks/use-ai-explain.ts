"use client";

import { useCallback, useState } from "react";

export type ExplainMode = "tecnico" | "claro" | "cliente";
type Status = "idle" | "loading" | "success" | "error";

type Citation = { quote: string };

type StructuredExplain = {
  executive: string;
  keyPoints: string[];
  favors: string[];
  limits: string[];
  risks: string[];
  recommendation: string;
  citations: Citation[];
};

type QAItem = {
  question: string;
  answer: string;
  citations: Citation[];
  createdAt: string;
};


function parseJsonLoose(raw: string) {
  const text = raw.trim();
  if (!text) return null;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  try {
    return JSON.parse(candidate) as Record<string, unknown>;
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((i): i is string => typeof i === "string" && Boolean(i.trim())).map((i) => i.trim())
    : [];
}

function normalizeStructuredFromAny(raw: unknown): StructuredExplain | null {
  const parsed =
    typeof raw === "string"
      ? parseJsonLoose(raw)
      : raw && typeof raw === "object"
        ? (raw as Record<string, unknown>)
        : null;

  if (!parsed) return null;

  const executive = typeof parsed.executive === "string" ? parsed.executive.trim() : "";
  const recommendation = typeof parsed.recommendation === "string" ? parsed.recommendation.trim() : "";
  const keyPoints = toStringArray(parsed.keyPoints);
  const favors = toStringArray(parsed.favors);
  const limits = toStringArray(parsed.limits);
  const risks = toStringArray(parsed.risks);
  const citations = Array.isArray(parsed.citations)
    ? parsed.citations
        .map((it) => (it && typeof it === "object" && typeof (it as { quote?: unknown }).quote === "string"
          ? { quote: String((it as { quote: string }).quote).trim() }
          : null))
        .filter((it): it is Citation => Boolean(it && it.quote))
        .slice(0, 4)
    : [];

  if (!executive) return null;

  return {
    executive,
    keyPoints,
    favors,
    limits,
    risks,
    recommendation,
    citations,
  };
}

function normalizeAnswerText(raw: unknown) {
  if (typeof raw !== "string") return "";
  const text = raw.trim();
  if (!text) return "";

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  try {
    const parsed = JSON.parse(candidate) as { answer?: unknown };
    if (typeof parsed?.answer === "string" && parsed.answer.trim()) return parsed.answer.trim();
  } catch {
    const m = candidate.match(/["']?answer["']?\s*:\s*"([\s\S]*?)"\s*(?:,|})/i);
    if (m?.[1]) {
      return m[1]
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .trim();
    }
  }

  return text;
}

export function useAiExplain() {
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState("");
  const [structured, setStructured] = useState<StructuredExplain | null>(null);
  const [answer, setAnswer] = useState("");
  const [answerCitations, setAnswerCitations] = useState<Citation[]>([]);
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);
  const [error, setError] = useState<string | undefined>();

  const explain = useCallback(async (text: string, mode: ExplainMode) => {
    if (!text.trim() || status === "loading") return;

    setStatus("loading");
    setError(undefined);
    setSummary("");
    setStructured(null);

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = payload?.detail || payload?.error;
        throw new Error(detail || "Error desconocido al generar la explicación.");
      }

      if (!payload?.summary) throw new Error("El servicio no devolvió un resumen válido.");

      const normalizedStructured = normalizeStructuredFromAny(payload.structured)
        ?? normalizeStructuredFromAny(payload.summary);

      setSummary(normalizedStructured?.executive || String(payload.summary));
      setStructured(normalizedStructured);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
      setStatus("error");
    }
  }, [status]);

  const ask = useCallback(async (text: string, question: string, mode: ExplainMode) => {
    if (!text.trim() || !question.trim() || status === "loading") return;

    setStatus("loading");
    setError(undefined);

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, question, mode }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = payload?.detail || payload?.error;
        throw new Error(detail || "Error desconocido al responder la pregunta.");
      }

      if (!payload?.answer) throw new Error("El servicio no devolvió una respuesta válida.");

      const nextAnswer = normalizeAnswerText(payload.answer);
      const nextCitations = Array.isArray(payload.citations) ? payload.citations : [];
      setAnswer(nextAnswer);
      setAnswerCitations(nextCitations);
      setQaHistory((prev) => [
        {
          question: question.trim(),
          answer: nextAnswer,
          citations: nextCitations,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 8));
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
      setStatus("error");
    }
  }, [status]);

  const clearHistory = useCallback(() => {
    setQaHistory([]);
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setSummary("");
    setStructured(null);
    setAnswer("");
    setAnswerCitations([]);
    setQaHistory([]);
    setError(undefined);
  }, []);

  return { explain, ask, clearHistory, reset, summary, structured, answer, answerCitations, qaHistory, status, error };
}
