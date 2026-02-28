"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { Scale, BookOpen, FileText, ArrowRight } from "lucide-react";

const sections = [
  {
    href: "/leyes",
    label: "Leyes",
    desc: "Catálogo normativo federal y estatal",
    icon: BookOpen,
    count: "500+",
  },
  {
    href: "/jurisprudencia",
    label: "Jurisprudencia",
    desc: "Semanario Judicial de la Federación",
    icon: Scale,
    count: "250k+",
  },
  {
    href: "/articulos",
    label: "Artículos",
    desc: "Consulta articulada por ley",
    icon: FileText,
    count: "100k+",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center px-4">
      {/* Hero glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-[500px] bg-hero-glow" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center pt-[14vh]">
        {/* Tag */}
        <div className="animate-fade-in rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
          <p className="text-2xs font-medium tracking-wide text-accent">
            Consulta jurídica mexicana
          </p>
        </div>

        {/* Title */}
        <h1
          className="mt-5 text-gradient text-5xl font-bold tracking-tight sm:text-6xl"
          style={{ animationDelay: "100ms" }}
        >
          Conjure
        </h1>
        <p
          className="mt-3 max-w-xl animate-fade-in text-center text-base leading-relaxed text-fg-2"
          style={{ animationDelay: "200ms" }}
        >
          Busca leyes, artículos y jurisprudencia de México en un solo lugar.
          Información pública, accesible y organizada.
        </p>

        {/* Search */}
        <div
          className="mt-10 w-full max-w-lg animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <SearchBar
            placeholder="Buscar jurisprudencia… ej: amparo, debido proceso"
            size="lg"
            onSearch={(q) =>
              router.push(`/jurisprudencia?q=${encodeURIComponent(q)}`)
            }
          />
        </div>

        {/* Section cards */}
        <div
          className="stagger-fade-up mt-14 grid w-full gap-3 sm:grid-cols-3"
          style={{ animationDelay: "400ms" }}
        >
          {sections.map(({ href, label, desc, icon: Icon, count }) => (
            <Link
              key={href}
              href={href}
              className="card-glow group relative flex flex-col rounded-xl border border-border/60 bg-surface/60 p-5 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                  <Icon className="h-4 w-4" />
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-fg-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold text-fg transition-colors group-hover:text-accent">
                {label}
              </h3>
              <p className="mt-1 text-2xs leading-relaxed text-fg-4">
                {desc}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/40" />
                <span className="font-mono text-2xs text-fg-4">
                  {count} registros
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="mt-12 flex items-center gap-8 animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          {[
            ["Leyes", "500+"],
            ["Tesis", "250k+"],
            ["Artículos", "100k+"],
          ].map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="font-mono text-lg font-semibold text-fg">
                {value}
              </p>
              <p className="text-2xs text-fg-4">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
