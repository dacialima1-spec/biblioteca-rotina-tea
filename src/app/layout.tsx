import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";
import { Header } from "@/components/header";
import { ServiceWorkerRegistration } from "@/components/service-worker";

export const metadata: Metadata = {
  title: "Biblioteca Rotina TEA",
  description: "Recursos visuais organizados para consultar, imprimir e registrar utilizações.",
  applicationName: "Biblioteca Rotina TEA",
  appleWebApp: { capable: true, title: "Rotina TEA" }
};

export const viewport: Viewport = { themeColor: "#ff5a1f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerRegistration />
        <Header />
        <main>{children}</main>
        <footer className="site-footer">
          <Image src="/personagens/nino.svg" width={95} height={105} alt="Nino, mascote capivara da Biblioteca Rotina TEA" />
          <div><b>Organizar também é uma conquista!</b><p>Este aplicativo não substitui acompanhamento profissional.</p></div>
        </footer>
      </body>
    </html>
  );
}
