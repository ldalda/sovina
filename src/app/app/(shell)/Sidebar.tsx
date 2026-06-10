"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import sovina from "@/assets/sovina-avatar.png";
import { signOut } from "@/app/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Painel" },
  { href: "/app/lancamentos", label: "Lançamentos" },
  { href: "/app/renda", label: "Fontes de Renda" },
  { href: "/app/investimentos", label: "Investimentos" },
  { href: "/app/custos", label: "Custos Fixos" },
  { href: "/app/cartoes", label: "Cartões" },
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
              aria-current={active ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "justify-start border font-normal tracking-tight",
                active
                  ? "border-solar text-solar bg-solar/5 hover:bg-solar/5 hover:text-solar"
                  : "border-transparent text-dim hover:bg-transparent hover:text-fg hover:border-line",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut} className="p-3 border-t border-line">
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start font-normal text-subtle hover:bg-transparent hover:text-furia"
        >
          Sair
        </Button>
      </form>
    </aside>
  );
}
