interface RecentSearchesProps {
  searches: string[];
  onSelect: (query: string) => void;
  onClear?: () => void;
  max?: number;
}

export function RecentSearches({ searches, onSelect, onClear, max = 5 }: RecentSearchesProps) {
  if (!searches.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-2xs text-fg-4">Recientes:</span>
      {searches.slice(0, max).map((query) => (
        <button
          key={query}
          onClick={() => onSelect(query)}
          className="rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
        >
          {query}
        </button>
      ))}
      {onClear && (
        <button
          onClick={onClear}
          className="rounded-md border border-border/40 px-2 py-1 text-2xs text-fg-4/70 hover:border-accent/20 hover:text-accent"
        >
          limpiar
        </button>
      )}
    </div>
  );
}
