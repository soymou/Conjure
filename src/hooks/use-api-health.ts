"use client";

import { useQuery } from "@tanstack/react-query";
import { healthDeepCheck } from "@/lib/api";

export function useApiHealth() {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: healthDeepCheck,
    staleTime: 30_000,
    refetchInterval: 30_000,
    retry: 0,
  });
}
