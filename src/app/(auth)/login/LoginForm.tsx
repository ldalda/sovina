"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

const initial: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return (
      <div className="border border-solar/40 bg-solar/[0.04] p-6">
        <p className="text-solar text-xs uppercase tracking-[0.3em] mb-3">
          Aguardando sua presença
        </p>
        <p className="font-display text-2xl uppercase mb-2">
          Cheque seu inbox.
        </p>
        <p className="text-dim text-sm leading-relaxed">
          Mandei um link para <span className="text-fg">{state.email}</span>.
          Clica nele pra entrar. Tem 10 minutos antes de eu desistir.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-[0.2em] text-dim"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          className="bg-concreto/30 border border-line px-3 py-2.5 text-fg placeholder:text-subtle focus:border-solar focus:outline-none transition-colors"
        />
      </div>

      {state.status === "error" && (
        <p className="text-furia text-sm">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-solar text-abismo px-4 py-3 font-bold tracking-tight hover:bg-solar/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Enviando…" : "Mandar link de acesso"}
      </button>

      <p className="text-subtle text-xs leading-relaxed">
        Sem senha. Sem cadastro. Só email. O Sovina não tem tempo pra
        burocracia.
      </p>
    </form>
  );
}
