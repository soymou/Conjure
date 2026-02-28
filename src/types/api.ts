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
  [key: string]: unknown;
}

// ── Artículos (Jurislex) ──
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
