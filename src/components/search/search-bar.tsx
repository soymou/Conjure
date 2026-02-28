"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2 } from "lucide-react";
import { searchSchema, type SearchFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  className?: string;
  size?: "sm" | "lg";
}

export function SearchBar({
  placeholder = "Buscar…",
  onSearch,
  isLoading,
  className,
  size = "sm",
}: SearchBarProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
  });

  const lg = size === "lg";

  return (
    <form
      onSubmit={handleSubmit((v) => onSearch(v.query))}
      className={cn("w-full", className)}
    >
      <div className="group relative">
        {/* Glow effect on focus */}
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 opacity-0 blur transition-all duration-500 group-focus-within:from-accent/20 group-focus-within:via-accent/10 group-focus-within:to-accent/20 group-focus-within:opacity-100" />

        <div className="relative">
          {isLoading ? (
            <Loader2
              className={cn(
                "absolute top-1/2 -translate-y-1/2 animate-spin text-accent",
                lg ? "left-4 h-4 w-4" : "left-3 h-3.5 w-3.5"
              )}
            />
          ) : (
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-fg-4 transition-colors group-focus-within:text-accent",
                lg ? "left-4 h-4 w-4" : "left-3 h-3.5 w-3.5"
              )}
            />
          )}
          <input
            {...register("query")}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            className={cn(
              "w-full rounded-xl border border-border/60 bg-surface/80 text-fg outline-none backdrop-blur-sm transition-all duration-300",
              "placeholder:text-fg-4/50 focus:border-accent/30 focus:bg-surface-2/80 focus:shadow-glow",
              lg
                ? "h-12 pl-12 pr-24 text-[13px]"
                : "h-10 pl-10 pr-20 text-[12px]"
            )}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-accent/10 font-medium text-accent transition-all duration-200",
              "hover:bg-accent/20 active:scale-95 disabled:opacity-30",
              lg ? "px-4 py-1.5 text-[12px]" : "px-3 py-1 text-[11px]"
            )}
          >
            Buscar
          </button>
        </div>
      </div>
      {errors.query && (
        <p className="mt-2 text-[11px] text-red-400/70">
          {errors.query.message}
        </p>
      )}
    </form>
  );
}
