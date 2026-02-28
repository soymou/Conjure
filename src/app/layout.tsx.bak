import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { HealthBanner } from "@/components/layout/health-banner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://conjure.app"),
  title: {
    default: "Conjure | Consulta jurídica mexicana",
    template: "%s | Conjure",
  },
  description: "Consulta leyes, artículos y jurisprudencia mexicana en una interfaz rápida y simple.",
  openGraph: {
    title: "Conjure",
    description: "Consulta jurídica mexicana",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conjure",
    description: "Consulta jurídica mexicana",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <HealthBanner />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-y-auto px-6 py-5">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
