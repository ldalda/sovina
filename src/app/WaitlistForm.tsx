"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { joinWaitlist, type WaitlistState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: WaitlistState = { status: "idle" };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initial);
  // origem do tráfego (?src=threads na bio) — gravada na coluna `source`
  const src = useSearchParams().get("src") ?? "";

  if (state.status === "joined" || state.status === "already") {
    const already = state.status === "already";
    return (
      <div className="border border-solar/40 bg-solar/[0.04] p-6 max-w-md">
        <p className="text-solar text-xs uppercase tracking-[0.3em] mb-3">
          {already ? "Eu não esqueço" : "Anotado"}
        </p>
        <p className="font-display text-2xl uppercase mb-2">
          {already ? "Você já está na fila." : "Seu nome está na lista."}
        </p>
        <p className="text-dim text-sm leading-relaxed">
          {already ? (
            <>
              Já tinha registrado{" "}
              <span className="text-fg">{state.email}</span>. Paciência — eu
              convoco quando for a hora.
            </>
          ) : (
            <>
              Quando o julgamento abrir,{" "}
              <span className="text-fg">{state.email}</span> será convocado. Não
              tente furar a fila.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative flex flex-col gap-3 max-w-md">
      <input type="hidden" name="src" value={src} />
      {/* honeypot: invisível pra humanos; bot que preencher recebe sucesso falso */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
      >
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          aria-label="Email"
          className="flex-1"
        />
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="font-bold tracking-tight"
        >
          {pending ? "Registrando…" : "Submeter-se ao julgamento →"}
        </Button>
      </div>

      {state.status === "error" && (
        <p className="text-furia text-sm">{state.message}</p>
      )}

      <p className="text-subtle text-xs leading-relaxed">
        Entre na lista de espera. Sem spam — o Sovina só fala quando tem
        veredito. Ao submeter, você concorda em receber o aviso de lançamento e
        com a{" "}
        <Link
          href="/privacidade"
          className="underline underline-offset-2 hover:text-fg"
        >
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
}
