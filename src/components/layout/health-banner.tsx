"use client";

import { AlertTriangle } from "lucide-react";
import { useApiHealth } from "@/hooks/use-api-health";

export function HealthBanner() {
  const { data, isLoading } = useApiHealth();

  if (isLoading || data?.ok) return null;

  return (
    <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-6 py-2">
      <p className="mx-auto flex max-w-4xl items-center gap-2 text-2xs text-yellow-300/90">
        <AlertTriangle className="h-3.5 w-3.5" />
        Servicio en modo degradado. Algunas consultas pueden fallar temporalmente.
      </p>
    </div>
  );
}
