"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search/search-bar";
import { LeyCard } from "@/components/results/ley-card";
import { Pagination } from "@/components/results/pagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useLeyes } from "@/hooks/use-leyes";
import { BookOpen } from "lucide-react";

const PER_PAGE = 16;

export default function LeyesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useLeyes(query || undefined);

  const filteredData = data || [];
  const totalPages = Math.ceil(filteredData.length / PER_PAGE);
  const paginatedData = filteredData.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const search = (q: string) => {
    setQuery(q);
    setPage(0);
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
