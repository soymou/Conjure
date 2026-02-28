"use client";

import { useCallback, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function useAiExplain() {
  const [status, setStatus] = useState<Status>("idle");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | undefined>();

  const explain = useCallback(async (text: string) => {
    if (!text.trim() || status === "loading") return;

    setStatus("loading");
    setError(undefined);
    setSummary("");

    console.log("/api/ai/explain payload", { text });

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const detail = payload?.detail || payload?.error;
        throw new Error(detail || "Error desconocido al generar la explicación.");
      }

      if (!payload?.summary) {
        throw new Error("El servicio no devolvió un resumen válido.");
      }

      setSummary(payload.summary);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
      setStatus("error");
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus("idle");
    setSummary("");
    setError(undefined);
  }, []);

  return { explain, reset, summary, status, error };
}
