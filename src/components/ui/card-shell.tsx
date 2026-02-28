import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardShellProps {
  children: ReactNode;
  className?: string;
}

export function CardShell({ children, className }: CardShellProps) {
  return (
    <div
      className={cn(
        "card-glow rounded-xl border border-border/60 bg-surface/60 px-4 py-3.5 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
