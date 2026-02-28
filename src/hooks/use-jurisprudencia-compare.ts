"use client";

import { useCallback, useState } from "react";
import type { JurisprudenciaItem } from "@/types/api";
import { getItem, setItem } from "@/lib/storage";

export const JURISPRUDENCIA_COMPARE_KEY = "jurisprudenciaCompare";

export type JurisprudenciaCompareItem = Pick<
  JurisprudenciaItem,
  "ius" | "rubro" | "fechaPublicacion" | "instancia" | "epoca" | "tipoDocumento" | "textoSnippet"
>;

export function useJurisprudenciaCompare() {
  const [, setVersion] = useState(0);

  const getAll = useCallback(() => {
    return getItem<JurisprudenciaCompareItem[]>(JURISPRUDENCIA_COMPARE_KEY, []);
  }, []);

  const check = useCallback((ius: number) => {
    return getItem<JurisprudenciaCompareItem[]>(JURISPRUDENCIA_COMPARE_KEY, []).some((item) => item.ius === ius);
  }, []);

  const toggle = useCallback((item: JurisprudenciaCompareItem) => {
    const selected = getItem<JurisprudenciaCompareItem[]>(JURISPRUDENCIA_COMPARE_KEY, []);
    const idx = selected.findIndex((current) => current.ius === item.ius);

    if (idx >= 0) {
      selected.splice(idx, 1);
      setItem(JURISPRUDENCIA_COMPARE_KEY, selected);
      setVersion((v) => v + 1);
      return false;
    }

    selected.push(item);
    setItem(JURISPRUDENCIA_COMPARE_KEY, selected);
    setVersion((v) => v + 1);
    return true;
  }, []);

  const remove = useCallback((ius: number) => {
    const selected = getItem<JurisprudenciaCompareItem[]>(JURISPRUDENCIA_COMPARE_KEY, []).filter((item) => item.ius !== ius);
    setItem(JURISPRUDENCIA_COMPARE_KEY, selected);
    setVersion((v) => v + 1);
  }, []);

  const clear = useCallback(() => {
    setItem<JurisprudenciaCompareItem[]>(JURISPRUDENCIA_COMPARE_KEY, []);
    setVersion((v) => v + 1);
  }, []);

  return { getAll, check, toggle, remove, clear };
}
