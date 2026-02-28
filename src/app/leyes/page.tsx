"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { LeyCard } from "@/components/results/ley-card";
import { Pagination } from "@/components/results/pagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { RecentSearches } from "@/components/ui/recent-searches";
import { useLeyes } from "@/hooks/use-leyes";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { buildQueryString, getNumberParam, getStringParam } from "@/lib/query-params";
import { BookOpen } from "lucide-react";

const PER_PAGE = 16;

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const { searches, add } = useRecentSearches("leyes");

  const [query, setQuery] = useState(() => getStringParam(params, "q"));
  const [page, setPage] = useState(() => getNumberParam(params, "page", 0));
  const { data, isLoading, error } = useLeyes(query || undefined);

  useEffect(() => {
    const qs = buildQueryString({
      q: query.trim() || undefined,
      page: page > 0 ? page : undefined,
    });
    router.replace(`/leyes${qs}`, { scroll: false });
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
        <PageHeader
          icon={<BookOpen className="h-4 w-4 text-accent" />}
          title="Leyes"
          description="Catálogo de legislaciones, tratados y convenios"
        />
      </div>

      <SearchBar placeholder="Buscar por nombre…" onSearch={search} isLoading={isLoading} />

      <RecentSearches searches={searches} onSelect={search} />

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
