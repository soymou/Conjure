"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { JurisprudenciaCard } from "@/components/results/jurisprudencia-card";
import { Pagination } from "@/components/results/pagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useJurisprudencia } from "@/hooks/use-jurisprudencia";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { useFavorites } from "@/hooks/use-favorites";
import { useJurisprudenciaCompare } from "@/hooks/use-jurisprudencia-compare";
import { Scale, ArrowRightLeft, X, Trash2 } from "lucide-react";

const SIZE = 20;
type SortMode = "fecha_desc" | "fecha_asc" | "ius_desc" | "ius_asc";

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const { searches, add } = useRecentSearches("jurisprudencia");
  const { getAll } = useFavorites();
  const compare = useJurisprudenciaCompare();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(Number(params.get("page") ?? "0") || 0);
  const [instancia, setInstancia] = useState(params.get("instancia") ?? "all");
  const [epoca, setEpoca] = useState(params.get("epoca") ?? "all");
  const [sort, setSort] = useState<SortMode>((params.get("sort") as SortMode) || "fecha_desc");

  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (page > 0) next.set("page", String(page));
    if (instancia !== "all") next.set("instancia", instancia);
    if (epoca !== "all") next.set("epoca", epoca);
    if (sort !== "fecha_desc") next.set("sort", sort);
    router.replace(next.toString() ? `/jurisprudencia?${next}` : "/jurisprudencia", {
      scroll: false,
    });
  }, [query, page, instancia, epoca, sort, router]);

  const { data, isLoading, error } = useJurisprudencia(query, page, SIZE);

  const selectedForCompare = compare.getAll();

  const search = (q: string) => {
    setQuery(q);
    setPage(0);
    if (q.trim()) add(q.trim());
  };

  const items = useMemo(() => {
    const base = data?.items ?? [];
    const filtered = base.filter((item) => {
      const instanciaOk = instancia === "all" || item.instancia === instancia;
      const epocaOk = epoca === "all" || item.epoca === epoca;
      return instanciaOk && epocaOk;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "fecha_asc":
          return new Date(a.fechaPublicacion).getTime() - new Date(b.fechaPublicacion).getTime();
        case "ius_desc":
          return b.ius - a.ius;
        case "ius_asc":
          return a.ius - b.ius;
        case "fecha_desc":
        default:
          return new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime();
      }
    });

    return sorted;
  }, [data?.items, epoca, instancia, sort]);

  const instancias = useMemo(
    () => Array.from(new Set((data?.items ?? []).map((i) => i.instancia).filter(Boolean))),
    [data?.items]
  );
  const epocas = useMemo(
    () => Array.from(new Set((data?.items ?? []).map((i) => i.epoca).filter(Boolean))),
    [data?.items]
  );

  const favoriteCount = getAll().filter((f) => f.type === "jurisprudencia").length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <Scale className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-[16px] font-semibold text-fg">Jurisprudencia</h1>
            <p className="text-2xs text-fg-4">Semanario Judicial de la Federación · {favoriteCount} favorito{favoriteCount !== 1 && "s"}</p>
          </div>
        </div>
      </div>

      <SearchBar
        placeholder="Buscar tesis… (amparo, propiedad, debido proceso)"
        onSearch={search}
        isLoading={isLoading}
      />

      {selectedForCompare.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-surface/60 p-3 shadow-card backdrop-blur-sm animate-fade-in space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xs text-fg-4">Selección para comparar: {selectedForCompare.length}</span>
            <Link
              href="/jurisprudencia/comparar"
              className={`focus-ring inline-flex items-center gap-1 rounded-md border px-2 py-1 text-2xs transition ${
                selectedForCompare.length >= 2
                  ? "border-accent/40 text-accent hover:bg-accent/10"
                  : "pointer-events-none border-border/60 text-fg-4/60"
              }`}
            >
              <ArrowRightLeft className="h-3 w-3" />
              comparar
            </Link>
            <button
              onClick={compare.clear}
              className="focus-ring inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
            >
              <Trash2 className="h-3 w-3" />
              limpiar selección
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedForCompare.map((item) => (
              <span key={item.ius} className="inline-flex max-w-full items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-3">
                <span className="font-mono text-fg-4">{item.ius}</span>
                <span className="truncate max-w-[180px]">{item.rubro}</span>
                <button
                  onClick={() => compare.remove(item.ius)}
                  className="text-fg-4 hover:text-accent"
                  aria-label={`Quitar ${item.ius} de la comparación`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          {selectedForCompare.length < 2 && (
            <p className="text-2xs text-fg-4/70">Selecciona al menos 2 tesis para comparar.</p>
          )}
        </div>
      )}

      {searches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs text-fg-4">Recientes:</span>
          {searches.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => search(s)}
              className="rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {query.length >= 2 && (
        <div className="grid gap-2 md:grid-cols-3">
          <select value={instancia} onChange={(e) => setInstancia(e.target.value)} className="rounded-lg border border-border/60 bg-surface/60 px-2 py-2 text-2xs text-fg">
            <option value="all">Todas las instancias</option>
            {instancias.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select value={epoca} onChange={(e) => setEpoca(e.target.value)} className="rounded-lg border border-border/60 bg-surface/60 px-2 py-2 text-2xs text-fg">
            <option value="all">Todas las épocas</option>
            {epocas.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="rounded-lg border border-border/60 bg-surface/60 px-2 py-2 text-2xs text-fg">
            <option value="fecha_desc">Más recientes</option>
            <option value="fecha_asc">Más antiguas</option>
            <option value="ius_desc">IUS (desc)</option>
            <option value="ius_asc">IUS (asc)</option>
          </select>
        </div>
      )}

      {error && <p className="text-[11px] text-red-400/70">{(error as Error).message}</p>}
      {isLoading && <Spinner label="Buscando…" />}

      {!isLoading && query.length < 2 && (
        <EmptyState title="Busca jurisprudencia" description="Mínimo 2 caracteres" />
      )}

      {!isLoading && query.length >= 2 && data && items.length === 0 && (
        <EmptyState description={`Sin resultados para "${query}"`} />
      )}

      {data && items.length > 0 && (
        <>
          <p className="font-mono text-2xs text-fg-4 animate-fade-in">
            {data.total.toLocaleString()} resultado{data.total !== 1 && "s"} · {data.page + 1}/{data.totalPages.toLocaleString()}
          </p>
          <div className="stagger-fade-up space-y-2">
            {items.map((item) => (
              <JurisprudenciaCard
                key={item.ius}
                item={item}
                compareSelected={compare.check(item.ius)}
                onToggleCompare={(current) => compare.toggle(current)}
              />
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
