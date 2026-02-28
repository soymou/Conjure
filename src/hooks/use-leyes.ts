"use client";

import { useQuery } from "@tanstack/react-query";
import { searchLeyes, fetchLeyes } from "@/lib/api";

export function useLeyes(nombre?: string) {
  return useQuery({
    queryKey: ["leyes", nombre ?? ""],
    queryFn: () => (nombre ? searchLeyes(nombre) : fetchLeyes()),
    staleTime: 5 * 60_000,
  });
}
