import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEB II - Portal de Consulta",
  description: "Material e referência para a prova de WEB II - ESUCRI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
