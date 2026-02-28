"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJurisprudenciaDetalle } from "@/lib/api";

export function useJurisprudenciaDetalle(ius: number | null) {
  return useQuery({
    queryKey: ["jurisprudencia-detalle", ius],
    queryFn: () => fetchJurisprudenciaDetalle(ius!),
    enabled: ius !== null,
    staleTime: 5 * 60_000,
  });
}
