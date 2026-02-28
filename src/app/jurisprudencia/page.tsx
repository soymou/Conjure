"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { JurisprudenciaCard } from "@/components/results/jurisprudencia-card";
import { Pagination } from "@/components/results/pagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useJurisprudencia } from "@/hooks/use-jurisprudencia";
import { Scale } from "lucide-react";

const SIZE = 20;

function Content() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const q = params.get("q");
    if (q) setQuery(q);
  }, [params]);

  const { data, isLoading, error } = useJurisprudencia(query, page, SIZE);

  const search = (q: string) => {
    setQuery(q);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <Scale className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-[16px] font-semibold text-fg">Jurisprudencia</h1>
            <p className="text-2xs text-fg-4">Semanario Judicial de la Federación</p>
          </div>
        </div>
      </div>

      <SearchBar
        placeholder="Buscar tesis… (amparo, propiedad, debido proceso)"
        onSearch={search}
        isLoading={isLoading}
      />

      {error && <p className="text-[11px] text-red-400/70">{(error as Error).message}</p>}
      {isLoading && <Spinner label="Buscando…" />}

      {!isLoading && query.length < 2 && (
        <EmptyState title="Busca jurisprudencia" description="Mínimo 2 caracteres" />
      )}

      {!isLoading && query.length >= 2 && data && data.items.length === 0 && (
        <EmptyState description={`Sin resultados para "${query}"`} />
      )}

      {data && data.items.length > 0 && (
        <>
          <p className="font-mono text-2xs text-fg-4 animate-fade-in">
            {data.total.toLocaleString()} resultado{data.total !== 1 && "s"} · {data.page + 1}/{data.totalPages.toLocaleString()}
          </p>
          <div className="stagger-fade-up space-y-2">
            {data.items.map((item) => (
              <JurisprudenciaCard key={item.ius} item={item} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default function JurisprudenciaPage() {
  return (
    <Suspense fallback={<Spinner label="Cargando…" />}>
      <Content />
    </Suspense>
  );
}
