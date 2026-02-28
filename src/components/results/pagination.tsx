"use client";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const Button = ({
    disabled,
    onClick,
    children,
  }: {
    disabled: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "focus-ring rounded-lg border px-3 py-1.5 font-mono text-2xs font-medium transition-all duration-200",
        disabled
          ? "cursor-not-allowed border-transparent text-fg-4/20"
          : "border-border/60 text-fg-3 hover:border-accent/30 hover:bg-accent/5 hover:text-accent active:scale-95"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-3 pt-8">
      <Button disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        ← Anterior
      </Button>
      <span className="min-w-[72px] text-center font-mono text-2xs text-fg-4">
        {page + 1} / {totalPages.toLocaleString()}
      </span>
      <Button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
        Siguiente →
      </Button>
    </div>
  );
}
