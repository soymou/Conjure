"use client";
import { useState, useEffect, useCallback } from "react";
import { getItem, setItem, THEME_KEY } from "@/lib/storage";

export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = getItem<Theme>(THEME_KEY, "dark");
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setItem(THEME_KEY, t);
    applyTheme(t);
  }, []);

  const toggle = useCallback(() => {
    setThemeState(prev => {
      const next = prev === "dark" ? "light" : "dark";
      setItem(THEME_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggle };
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
    root.classList.remove("light");
  }
}
