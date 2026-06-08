"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import sovina from "@/assets/sovina-avatar.png";
import { signOut } from "@/app/app/actions";

const NAV = [
  { href: "/app", label: "Painel" },
  { href: "/app/renda", label: "Fontes de Renda" },
  { href: "/app/investimentos", label: "Investimentos" },
  { href: "/app/custos", label: "Custos Fixos" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-line flex flex-col">
      <div className="px-5 py-5 border-b border-line flex items-center gap-3">
        <Image
          src={sovina}
          alt="O Sovina"
          width={36}
          className="h-9 w-auto select-none pointer-events-none"
        />
        <span className="font-display text-xl tracking-tight">SOVINA</span>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm tracking-tight border transition-colors ${
                active
                  ? "border-solar text-solar bg-solar/5"
                  : "border-transparent text-dim hover:text-fg hover:border-line"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut} className="p-3 border-t border-line">
        <button
          type="submit"
          className="w-full text-left px-3 py-2 text-sm text-subtle hover:text-furia transition-colors"
        >
          Sair
        </button>
      </form>
    </aside>
  );
}
