"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { ArticuloCard } from "@/components/results/articulo-card";
import { Pagination } from "@/components/results/pagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useLeyes } from "@/hooks/use-leyes";
import { useArticulos } from "@/hooks/use-articulos";
import { LeyCard } from "@/components/results/ley-card";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { FileText, ArrowLeft } from "lucide-react";

const PER_PAGE = 20;

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const { searches, add } = useRecentSearches("articulos-selector");

  const [cat, setCat] = useState<number | null>(params.get("cat") ? +params.get("cat")! : null);
  const [ley, setLey] = useState<number | null>(params.get("ley") ? +params.get("ley")! : null);
  const [nombre, setNombre] = useState(params.get("nombre") ?? "");
  const [leyQ, setLeyQ] = useState(params.get("q") ?? "");
  const [pg, setPg] = useState(Number(params.get("page") ?? "0") || 0);

  useEffect(() => {
    const next = new URLSearchParams();
    if (cat !== null) next.set("cat", String(cat));
    if (ley !== null) next.set("ley", String(ley));
    if (nombre) next.set("nombre", nombre);
    if (leyQ.trim()) next.set("q", leyQ.trim());
    if (pg > 0) next.set("page", String(pg));
    router.replace(next.toString() ? `/articulos?${next}` : "/articulos", { scroll: false });
  }, [cat, ley, nombre, leyQ, pg, router]);

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
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <FileText className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h1 className="text-[16px] font-semibold text-fg">Artículos</h1>
              <p className="text-2xs text-fg-4">{nombre}</p>
            </div>
          </div>
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
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <FileText className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-[16px] font-semibold text-fg">Artículos</h1>
            <p className="text-2xs text-fg-4">
              Selecciona una ley para consultar
            </p>
          </div>
        </div>
      </div>

      <SearchBar placeholder="Buscar ley…" onSearch={(q) => {
        setLeyQ(q);
        add(q.trim());
      }} isLoading={leyesL} />

      {searches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs text-fg-4">Recientes:</span>
          {searches.slice(0, 5).map((s) => (
            <button key={s} onClick={() => setLeyQ(s)} className="rounded-md border border-border/60 px-2 py-1 text-2xs text-fg-4 hover:border-accent/30 hover:text-accent">{s}</button>
          ))}
        </div>
      )}

      {leyesL && <Spinner label="Cargando…" />}
      {leyes && leyes.length === 0 && <EmptyState />}

      {leyes && leyes.length > 0 && (
        <>
          <p className="font-mono text-2xs text-fg-4 animate-fade-in">
            {leyes.length} legislación{leyes.length !== 1 && "es"}
          </p>
          <div className="stagger-fade-up grid gap-2 md:grid-cols-2">
            {leyes.map((l) => (
              <div
                key={l.id}
                onClick={() => select(l.categoria, l.id, l.nombre)}
                className="cursor-pointer"
              >
                <LeyCard ley={l} />
              </div>
            ))}
          </div>
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
