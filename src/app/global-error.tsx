"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-bg p-6 text-fg">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <h2 className="text-sm font-semibold text-red-300">No se pudo renderizar la aplicación</h2>
          <button
            onClick={reset}
            className="mt-4 rounded-md border border-red-400/30 px-3 py-1.5 text-2xs text-red-200 hover:bg-red-500/10"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
