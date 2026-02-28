"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { LeyCard } from "@/components/results/ley-card";
import { Pagination } from "@/components/results/pagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useLeyes } from "@/hooks/use-leyes";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { BookOpen } from "lucide-react";

const PER_PAGE = 16;

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const { searches, add } = useRecentSearches("leyes");

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(Number(params.get("page") ?? "0") || 0);
  const { data, isLoading, error } = useLeyes(query || undefined);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (page > 0) next.set("page", String(page));
    router.replace(next.toString() ? `/leyes?${next}` : "/leyes", { scroll: false });
  }, [query, page, router]);

  const filteredData = data || [];
  const totalPages = Math.ceil(filteredData.length / PER_PAGE);
  const paginatedData = filteredData.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const search = (q: string) => {
    setQuery(q);
    setPage(0);
    if (q.trim()) add(q.trim());
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <BookOpen className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-[16px] font-semibold text-fg">Leyes</h1>
            <p className="text-2xs text-fg-4">
              Catálogo de legislaciones, tratados y convenios
            </p>
          </div>
        </div>
      </div>

      <SearchBar placeholder="Buscar por nombre…" onSearch={search} isLoading={isLoading} />

      {searches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs text-fg-4">Recientes:</span>
          {searches.slice(0, 5).map((s) => (
            <button key={s} onClick={() => search(s)} className="rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent">{s}</button>
          ))}
        </div>
      )}

      {error && <p className="text-[11px] text-red-400/70">{(error as Error).message}</p>}
      {isLoading && <Spinner label="Cargando…" />}

      {!isLoading && filteredData.length === 0 && <EmptyState description="Intenta con otro término" />}

      {!isLoading && filteredData.length > 0 && (
        <>
          <p className="font-mono text-2xs text-fg-4 animate-fade-in">
            {filteredData.length} resultado{filteredData.length !== 1 && "s"}
          </p>
          <div className="stagger-fade-up grid gap-2 md:grid-cols-2">
            {paginatedData.map((ley) => (
              <LeyCard key={ley.id} ley={ley} />
            ))}
          </div>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}

export default function LeyesPage() {
  return (
    <Suspense fallback={<Spinner label="Cargando…" />}>
      <Content />
    </Suspense>
  );
}
