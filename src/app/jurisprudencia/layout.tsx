import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jurisprudencia",
  description: "Busca tesis y criterios del Semanario Judicial de la Federación.",
};

export default function JurisprudenciaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
