import type {
  Ley,
  JurisprudenciaResponse,
  JurisprudenciaDetalle,
  ArticulosResponse,
  ApiError as ApiErrorType,
} from "@/types/api";
import { ApiError } from "@/types/api";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "https://ordina-engine.vercel.app";

async function fetcher<T>(path: string): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError({
      status: 0,
      statusText: "Network Error",
      path,
      message: "No se pudo conectar con el servicio. Revisa tu conexión.",
      details: error,
    });
  }

  if (!res.ok) {
    let details: unknown;
    try {
      details = await res.json();
    } catch {
      try {
        details = await res.text();
      } catch {
        details = undefined;
      }
    }

    throw new ApiError({
      status: res.status,
      statusText: res.statusText,
      path,
      message: `Error ${res.status} al consultar ${path}`,
      details,
    });
  }

  try {
    return (await res.json()) as T;
  } catch (error) {
    throw new ApiError({
      status: res.status,
      statusText: res.statusText,
      path,
      message: "Respuesta inválida del servidor.",
      details: error,
    });
  }
}

export type { ApiErrorType };

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

// ── Artículos ──
export const fetchArticulos = (
  categoria: number,
  idLegislacion: number,
  indice = 0,
  elementos = 20
) =>
  fetcher<ArticulosResponse>(
    `/jurislex/articulos/buscar?categoria=${categoria}&idLegislacion=${idLegislacion}&soloArticulo=true&indice=${indice}&elementos=${elementos}`
  );

export async function healthDeepCheck() {
  const attempts = ["/health/deep", "/health", "/actuator/health"];

  for (const endpoint of attempts) {
    try {
      await fetcher<unknown>(endpoint);
      return { ok: true, endpoint };
    } catch {
      // next endpoint
    }
  }

  return { ok: false, endpoint: attempts[0] };
}
