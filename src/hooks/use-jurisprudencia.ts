"use client";

import { useQuery } from "@tanstack/react-query";
import { searchJurisprudencia } from "@/lib/api";

export function useJurisprudencia(q: string, page = 0, size = 10) {
  return useQuery({
    queryKey: ["jurisprudencia", q, page, size],
    queryFn: () => searchJurisprudencia(q, page, size),
    enabled: q.length >= 2,
    staleTime: 5 * 60_000,
  });
}
