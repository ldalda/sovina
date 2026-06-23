"use client";

import { useActionState } from "react";
import { saveWhatsApp, type WhatsAppState } from "./whatsapp-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: WhatsAppState = { status: "idle" };

// Card de captura do WhatsApp + opt-in. Aparece no painel enquanto o usuário
// não optou. O copy planta o diferencial (tom de juiz), não a feature:
// qualquer um "registra por mensagem"; só o Sovina te cobra sem dó.
export function WhatsAppOptin() {
  const [state, formAction, pending] = useActionState(saveWhatsApp, initial);

  if (state.status === "saved") {
    return (
      <Card>
        <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
          Anotado
        </p>
        <p className="text-dim text-sm leading-relaxed">
          Quando a cobrança no WhatsApp abrir, seu número será dos primeiros. Não
          diga que não foi avisado.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Em breve
      </p>
      <p className="font-display text-xl uppercase mb-2">
        Quer que eu te cobre no WhatsApp?
      </p>
      <p className="text-dim text-sm leading-relaxed mb-4">
        Não é mais um robô que anota seu gasto. É o juiz batendo na sua porta com
        a sua cota do dia — antes de você furar. Deixa o número e fura a fila do
        fast-follow.
      </p>

      <form action={formAction} className="flex flex-col gap-3">
        <Input
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="(11) 98888-7777"
          aria-label="Seu WhatsApp"
        />

        <label className="flex items-start gap-2 text-subtle text-xs leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 accent-solar"
          />
          <span>
            Autorizo o Sovina a me cobrar no WhatsApp. Posso revogar quando
            quiser.
          </span>
        </label>

        {state.status === "error" && (
          <p className="text-furia text-sm">{state.message}</p>
        )}

        <Button type="submit" disabled={pending} className="font-bold">
          {pending ? "Anotando…" : "Quero ser cobrado →"}
        </Button>
      </form>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-solar/40 bg-solar/[0.04] p-5">{children}</div>
  );
}
