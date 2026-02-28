// ── Leyes ──
export interface Ley {
  id: number;
  nombre: string;
  categoria: number;
}

// ── Jurisprudencia ──
export interface JurisprudenciaItem {
  ius: number;
  isSemanal: boolean;
  rubro: string;
  fechaPublicacion: string;
  instancia: string;
  epoca: string;
  tipoDocumento: string;
  textoSnippet: string;
}

export interface JurisprudenciaResponse {
  total: number;
  totalPages: number;
  page: number;
  size: number;
  count: number;
  hasMore: boolean;
  items: JurisprudenciaItem[];
}

export interface JurisprudenciaDetalle {
  ius: number;
  rubro: string;
  texto: string;
  instancia?: string;
  epoca?: string;
  tipoDocumento?: string;
  fechaPublicacion?: string;
  precedente?: string;
  [key: string]: unknown;
}

// ── Artículos (Jurislex) ──
export interface ArticuloItem {
  idArticulo: number;
  idLegislacion: number;
  numeroArticulo: number;
  tipo: number;
  ley: string;
  texto: string;
  textoPlano: string;
}

export interface ArticulosResponse {
  categoria: number;
  idLegislacion: number;
  indice: number;
  elementos: number;
  count: number;
  total: number;
  totalArticulos: number;
  items: ArticuloItem[];
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  path: string;
  details?: unknown;

  constructor({ status, statusText, path, message, details }: {
    status: number;
    statusText: string;
    path: string;
    message?: string;
    details?: unknown;
  }) {
    super(message ?? `API ${status}: ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.path = path;
    this.details = details;
  }
}
