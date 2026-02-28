import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leyes",
  description: "Catálogo de legislaciones, tratados y convenios para consulta rápida.",
};

export default function LeyesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
