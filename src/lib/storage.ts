// localStorage helpers with SSR safety

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export type FavoriteItem = {
  type: "ley" | "jurisprudencia" | "articulo";
  id: string | number;
  label: string;
  subtitle?: string;
  data: unknown;
};

export const FAVORITES_KEY = "favorites";
export const RECENT_SEARCHES_KEY = "recentSearches";
export const THEME_KEY = "theme";

export function getFavorites(): FavoriteItem[] {
  return getItem<FavoriteItem[]>(FAVORITES_KEY, []);
}

export function isFavorite(type: FavoriteItem["type"], id: string | number): boolean {
  return getFavorites().some((f) => f.type === type && f.id === id);
}

export function toggleFavorite(item: FavoriteItem): boolean {
  const favs = getFavorites();
  const idx = favs.findIndex((f) => f.type === item.type && f.id === item.id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    setItem(FAVORITES_KEY, favs);
    return false;
  } else {
    favs.unshift(item);
    setItem(FAVORITES_KEY, favs);
    return true;
  }
}

export function removeFavorite(type: FavoriteItem["type"], id: string | number): void {
  const favs = getFavorites().filter((f) => !(f.type === type && f.id === id));
  setItem(FAVORITES_KEY, favs);
}

export function getRecentSearches(ns: string): string[] {
  return getItem<string[]>(`${RECENT_SEARCHES_KEY}:${ns}`, []);
}

export function addRecentSearch(ns: string, q: string): void {
  if (!q.trim()) return;
  let searches = getRecentSearches(ns);
  searches = [q, ...searches.filter((s) => s !== q)].slice(0, 10);
  setItem(`${RECENT_SEARCHES_KEY}:${ns}`, searches);
}

export function clearRecentSearches(ns: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${RECENT_SEARCHES_KEY}:${ns}`);
}
