export function Footer() {
  return (
    <footer className="border-gradient border-t border-border/30 py-4 text-center">
      <div className="flex items-center justify-center gap-3 text-2xs text-fg-4/50">
        <span className="font-semibold text-fg-4/70">Conjure</span>
        <span>·</span>
        <span>información jurídica pública</span>
        <span>·</span>
        <span>no oficial</span>
        <span>·</span>
        <a
          href="https://github.com/diegoju/Ordina-engine"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent/50 underline decoration-accent/20 underline-offset-2 transition hover:text-accent/80"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
