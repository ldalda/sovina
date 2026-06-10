import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "O Sovina — Você presta contas a ele",
  description:
    "O gestor financeiro autoritário. Uma inteligência que decreta quanto você pode gastar por dia — implacável, matemática, sem espaço pra desculpa.",
  openGraph: {
    title: "O Sovina — o juiz do seu dinheiro",
    description:
      "Cada gasto recebe um veredito. Cada desculpa, uma resposta em reais. Entre na fila do julgamento.",
    url: appUrl,
    siteName: "O Sovina",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "O Sovina — o juiz do seu dinheiro",
    description:
      "Cada gasto recebe um veredito. Cada desculpa, uma resposta em reais.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
