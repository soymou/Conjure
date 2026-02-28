"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArticulos } from "@/lib/api";

export function useArticulos(
  categoria: number | null,
  idLegislacion: number | null,
  indice = 0,
  elementos = 20
) {
  return useQuery({
    queryKey: ["articulos", categoria, idLegislacion, indice, elementos],
    queryFn: () => fetchArticulos(categoria!, idLegislacion!, indice, elementos),
    enabled: categoria !== null && idLegislacion !== null,
    staleTime: 5 * 60_000,
  });
}
