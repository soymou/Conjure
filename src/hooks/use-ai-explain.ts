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

      setSummary(payload.summary);
      setStructured(payload.structured ?? null);
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
