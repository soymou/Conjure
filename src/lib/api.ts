import type {
  Ley,
  JurisprudenciaResponse,
  JurisprudenciaDetalle,
  ArticulosResponse,
} from "@/types/api";

const BASE = "https://ordina-engine.vercel.app";

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Leyes ──
export const fetchLeyes = () => fetcher<Ley[]>("/ley");

export const searchLeyes = (nombre: string) =>
  fetcher<Ley[]>(`/ley?nombre=${encodeURIComponent(nombre)}`);

// ── Jurisprudencia ──
export const searchJurisprudencia = (q: string, page = 0, size = 10) =>
  fetcher<JurisprudenciaResponse>(
    `/jurisprudencia/buscar?q=${encodeURIComponent(q)}&page=${page}&size=${size}`
  );

export const fetchJurisprudenciaDetalle = (ius: number) =>
  fetcher<JurisprudenciaDetalle>(`/jurisprudencia/detalle?ius=${ius}`);

// ── Artículos ──
export const fetchArticulos = (
  categoria: number,
  idLegislacion: number,
  indice = 0,
  elementos = 20
) =>
  fetcher<ArticulosResponse>(
    `/jurislex/articulos/buscar?categoria=${categoria}&idLegislacion=${idLegislacion}&soloArticulo=true&indice=${indice}&elementos=${elementos}`
  );
