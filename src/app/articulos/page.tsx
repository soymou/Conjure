"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { ArticuloCard } from "@/components/results/articulo-card";
import { Pagination } from "@/components/results/pagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { RecentSearches } from "@/components/ui/recent-searches";
import { useLeyes } from "@/hooks/use-leyes";
import { useArticulos } from "@/hooks/use-articulos";
import { LeyCard } from "@/components/results/ley-card";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { buildQueryString, getNumberParam, getOptionalNumberParam, getStringParam } from "@/lib/query-params";
import { FileText, ArrowLeft } from "lucide-react";

const PER_PAGE = 20;
const LEYES_PER_PAGE = 16;

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const { searches, add } = useRecentSearches("articulos-selector");

  const [cat, setCat] = useState<number | null>(() => getOptionalNumberParam(params, "cat"));
  const [ley, setLey] = useState<number | null>(() => getOptionalNumberParam(params, "ley"));
  const [nombre, setNombre] = useState(() => getStringParam(params, "nombre"));
  const [leyQ, setLeyQ] = useState(() => getStringParam(params, "q"));
  const [pg, setPg] = useState(() => getNumberParam(params, "page", 0));
  const [leyPg, setLeyPg] = useState(() => getNumberParam(params, "leyPage", 0));

  useEffect(() => {
    const qs = buildQueryString({
      cat,
      ley,
      nombre: nombre || undefined,
      q: leyQ.trim() || undefined,
      page: pg > 0 ? pg : undefined,
      leyPage: leyPg > 0 ? leyPg : undefined,
    });
    router.replace(`/articulos${qs}`, { scroll: false });
  }, [cat, ley, nombre, leyQ, pg, leyPg, router]);

  const { data: leyes, isLoading: leyesL } = useLeyes(
    !ley ? leyQ || undefined : undefined
  );
  const { data: arts, isLoading: artsL } = useArticulos(
    cat,
    ley,
    pg * PER_PAGE,
    PER_PAGE
  );

  const totalPages = arts ? Math.ceil(arts.totalArticulos / PER_PAGE) : 0;
  const totalLeyesPages = leyes ? Math.ceil(leyes.length / LEYES_PER_PAGE) : 0;
  const leyesPageData = leyes
    ? leyes.slice(leyPg * LEYES_PER_PAGE, (leyPg + 1) * LEYES_PER_PAGE)
    : [];

  const select = (c: number, id: number, n: string) => {
    setCat(c);
    setLey(id);
    setNombre(n);
    setPg(0);
  };
  const back = () => {
    setCat(null);
    setLey(null);
    setNombre("");
    setPg(0);
  };

  useEffect(() => {
    setLeyPg(0);
  }, [leyQ]);

  useEffect(() => {
    if (!leyes) return;
    const max = Math.max(0, Math.ceil(leyes.length / LEYES_PER_PAGE) - 1);
    if (leyPg > max) setLeyPg(max);
  }, [leyes, leyPg]);

  if (ley !== null && cat !== null) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="animate-fade-in">
          <button
            onClick={back}
            className="focus-ring mb-3 flex items-center gap-1.5 rounded-lg px-2 py-1 text-2xs text-fg-4 transition-all hover:bg-surface-2 hover:text-fg-3"
          >
            <ArrowLeft className="h-3 w-3" />
            volver
          </button>
          <PageHeader
            icon={<FileText className="h-4 w-4 text-accent" />}
            title="Artículos"
            description={nombre}
          />
        </div>

        {artsL && <Spinner label="Cargando artículos…" />}
        {arts && arts.items.length === 0 && (
          <EmptyState description="Sin artículos disponibles" />
        )}

        {arts && arts.items.length > 0 && (
          <>
            <p className="font-mono text-2xs text-fg-4 animate-fade-in">
              {arts.totalArticulos} artículo
              {arts.totalArticulos !== 1 && "s"}
            </p>
            <div className="stagger-fade-up space-y-2">
              {arts.items.map((a) => (
                <ArticuloCard key={a.idArticulo} item={a} />
              ))}
            </div>
            <Pagination page={pg} totalPages={totalPages} onPageChange={setPg} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="animate-fade-in">
        <PageHeader
          icon={<FileText className="h-4 w-4 text-accent" />}
          title="Artículos"
          description="Selecciona una ley para consultar"
        />
      </div>

      <SearchBar
        placeholder="Buscar ley…"
        onSearch={(q) => {
          setLeyQ(q);
          add(q.trim());
        }}
        isLoading={leyesL}
      />

      <RecentSearches searches={searches} onSelect={setLeyQ} />

      {leyesL && <Spinner label="Cargando…" />}
      {leyes && leyes.length === 0 && <EmptyState />}

      {leyes && leyes.length > 0 && (
        <>
          <p className="font-mono text-2xs text-fg-4 animate-fade-in">
            {leyes.length} legislación{leyes.length !== 1 && "es"}
          </p>
          <div className="stagger-fade-up grid gap-2 md:grid-cols-2">
            {leyesPageData.map((l) => (
              <div
                key={l.id}
                onClick={() => select(l.categoria, l.id, l.nombre)}
                className="cursor-pointer"
              >
                <LeyCard ley={l} />
              </div>
            ))}
          </div>
          {totalLeyesPages > 1 && (
            <Pagination page={leyPg} totalPages={totalLeyesPages} onPageChange={setLeyPg} />
          )}
        </>
      )}
    </div>
  );
}

export default function ArticulosPage() {
  return (
    <Suspense fallback={<Spinner label="Cargando…" />}>
      <Content />
    </Suspense>
  );
}
