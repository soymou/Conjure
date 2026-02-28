type ParamSource = {
  get: (key: string) => string | null;
};

export function getStringParam(params: ParamSource, key: string, fallback = "") {
  const value = params.get(key);
  return value ?? fallback;
}

export function getNumberParam(params: ParamSource, key: string, fallback = 0) {
  const raw = params.get(key);
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}


export function getOptionalNumberParam(params: ParamSource, key: string) {
  const raw = params.get(key);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function getEnumParam<T extends string>(
  params: ParamSource,
  key: string,
  allowed: readonly T[],
  fallback: T
) {
  const value = params.get(key);
  if (value && allowed.includes(value as T)) return value as T;
  return fallback;
}

export function buildQueryString(
  params: Record<string, string | number | null | undefined>
) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    next.set(key, String(value));
  }
  const qs = next.toString();
  return qs ? `?${qs}` : "";
}
