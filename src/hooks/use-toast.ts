"use client";
import { useCallback } from "react";
import { useToastStore } from "@/components/ui/toast-store";

export function useToast() {
  const show = useToastStore(s => s.show);
  return useCallback((message: string, type: "success" | "error" = "success") => {
    show(message, type);
  }, [show]);
}
