"use client";
import { useState, useCallback } from "react";
import { toggleFavorite, isFavorite, type FavoriteItem, FAVORITES_KEY, getItem } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export function useFavorites() {
  const toast = useToast();
  const [, setVersion] = useState(0);

  const toggle = useCallback((item: FavoriteItem) => {
    const added = toggleFavorite(item);
    setVersion(v => v + 1);
    toast(added ? "Guardado en favoritos" : "Eliminado de favoritos");
    return added;
  }, [toast]);

  const check = useCallback((type: FavoriteItem["type"], id: string | number) => {
    return isFavorite(type, id);
  }, []);

  const getAll = useCallback(() => {
    return getItem<FavoriteItem[]>(FAVORITES_KEY, []);
  }, []);

  return { toggle, check, getAll };
}
