export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-accent/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
      </div>
      {label && <p className="text-2xs text-fg-4 animate-pulse">{label}</p>}
    </div>
  );
}
