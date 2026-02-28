"use client";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useClipboard() {
  const toast = useToast();

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copiado al portapapeles");
    } catch {
      toast("No se pudo copiar", "error");
    }
  }, [toast]);

  return { copy };
}
