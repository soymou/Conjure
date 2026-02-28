import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artículos",
  description: "Consulta artículos por ley y categoría desde Jurislex.",
};

export default function ArticulosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
