import { SearchX } from "lucide-react";

export function EmptyState({
  title = "Sin resultados",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2">
        <SearchX className="h-5 w-5 text-fg-4" />
      </div>
      <p className="text-[13px] font-medium text-fg-3">{title}</p>
      {description && <p className="text-2xs text-fg-4/60">{description}</p>}
    </div>
  );
}
