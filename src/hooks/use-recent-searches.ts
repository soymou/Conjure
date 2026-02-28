"use client";
import { useState, useCallback, useEffect } from "react";
import { getRecentSearches, addRecentSearch } from "@/lib/storage";

export function useRecentSearches(ns: string) {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    setSearches(getRecentSearches(ns));
  }, [ns]);

  const add = useCallback((q: string) => {
    addRecentSearch(ns, q);
    setSearches(getRecentSearches(ns));
  }, [ns]);

  const clear = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`recentSearches:${ns}`);
      setSearches([]);
    }
  }, [ns]);

  return { searches, add, clear };
}
