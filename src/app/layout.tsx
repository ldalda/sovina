import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

// Inter — corpo de texto e UI. Neutra, alta legibilidade em qualquer tamanho.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Anton — display. Robusta, pesada, quase agressiva. Reservada pra títulos
// e números gigantes (cota diária, saldo, contador de streaks).
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
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
    <html
      lang="pt-BR"
      className={`${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
