import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "highlight";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-2xs font-medium",
        variant === "highlight"
          ? "bg-accent/10 text-accent"
          : "bg-surface-2 text-fg-4"
      )}
    >
      {children}
    </span>
  );
}
