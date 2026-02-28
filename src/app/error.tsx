"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
      <h2 className="text-sm font-semibold text-red-300">Ocurrió un error inesperado</h2>
      <p className="mt-2 text-2xs text-red-200/80">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md border border-red-400/30 px-3 py-1.5 text-2xs text-red-200 hover:bg-red-500/10"
      >
        Reintentar
      </button>
    </div>
  );
}
