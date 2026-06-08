import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// JetBrains Mono é mais densa e tem números tabulares — bate com estética
// brutalista de planilha financeira.
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sovina — Você presta contas a ele",
  description:
    "O primeiro gestor financeiro gamificado governado por uma inteligência autoritária. Você não gere seu dinheiro, você presta contas a ele.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
