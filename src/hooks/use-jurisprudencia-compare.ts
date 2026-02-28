"use client";

import { useCallback, useState } from "react";
import type { JurisprudenciaItem } from "@/types/api";
import { getItem, setItem } from "@/lib/storage";

export const JURISPRUDENCIA_COMPARE_KEY = "jurisprudenciaCompare";

export type JurisprudenciaCompareItem = Pick<
  JurisprudenciaItem,
  "ius" | "rubro" | "fechaPublicacion" | "instancia" | "epoca" | "tipoDocumento" | "textoSnippet"
>;

const readInitial = () =>
  getItem<JurisprudenciaCompareItem[]>(JURISPRUDENCIA_COMPARE_KEY, []);

export function useJurisprudenciaCompare() {
  const [selected, setSelected] = useState<JurisprudenciaCompareItem[]>(readInitial);

  const persist = useCallback((next: JurisprudenciaCompareItem[]) => {
    setSelected(next);
    setItem(JURISPRUDENCIA_COMPARE_KEY, next);
  }, []);

  const getAll = useCallback(() => selected, [selected]);

  const check = useCallback(
    (ius: number) => selected.some((item) => item.ius === ius),
    [selected]
  );

  const toggle = useCallback(
    (item: JurisprudenciaCompareItem) => {
      const exists = selected.some((current) => current.ius === item.ius);
      const next = exists
        ? selected.filter((current) => current.ius !== item.ius)
        : [...selected, item];
      persist(next);
      return !exists;
    },
    [persist, selected]
  );

  const remove = useCallback(
    (ius: number) => {
      const next = selected.filter((item) => item.ius !== ius);
      persist(next);
    },
    [persist, selected]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  return { getAll, check, toggle, remove, clear };
}
