import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExplainPanel } from "@/components/ui/explain-panel";
import type { JurisprudenciaDetalle } from "@/types/api";
import { sanitizeHtml } from "@/lib/utils";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://ordina-engine.vercel.app";

async function getDetalle(ius: number): Promise<JurisprudenciaDetalle | null> {
  const res = await fetch(`${BASE}/jurisprudencia/detalle?ius=${ius}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;
  return (await res.json()) as JurisprudenciaDetalle;
}

export async function generateMetadata({ params }: { params: { ius: string } }): Promise<Metadata> {
  const ius = Number(params.ius);
  const detalle = Number.isNaN(ius) ? null : await getDetalle(ius);

  return {
    title: detalle ? `${detalle.rubro} | Jurisprudencia` : `Tesis ${params.ius} | Jurisprudencia`,
    description: detalle?.texto?.slice(0, 160) || "Detalle de tesis de jurisprudencia",
  };
}

export default async function JurisprudenciaDetallePage({ params }: { params: { ius: string } }) {
  const ius = Number(params.ius);
  if (Number.isNaN(ius)) {
    return <p className="text-sm text-red-400/70">IUS inválido.</p>;
  }

  const detalle = await getDetalle(ius);

  if (!detalle) {
    return <p className="text-sm text-red-400/70">No se pudo cargar el detalle de la tesis.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="animate-fade-in">
        <Link
          href="/jurisprudencia"
          className="focus-ring mb-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-2xs text-fg-4 transition-all hover:bg-surface-2 hover:text-fg-3"
        >
          <ArrowLeft className="h-3 w-3" />
          volver
        </Link>
        <h1 className="text-[16px] font-semibold text-fg">{detalle.rubro}</h1>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge variant="highlight">IUS {detalle.ius}</Badge>
          {detalle.instancia && <Badge>{detalle.instancia}</Badge>}
          {detalle.epoca && <Badge>{detalle.epoca}</Badge>}
          {detalle.tipoDocumento && <Badge>{detalle.tipoDocumento}</Badge>}
        </div>
      </div>

      <article
        className="rounded-xl border border-border/60 bg-surface/60 px-4 py-4 text-[12px] leading-relaxed text-fg-3 shadow-card backdrop-blur-sm"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(detalle.texto || "Sin contenido.") }}
      />
      <ExplainPanel
        text={String(detalle.texto ?? detalle.textoSnippet ?? "")}
        helper="Generado con un modelo gratuito compartido (Hugging Face)."
      />
    </div>
  );
}
