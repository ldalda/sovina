import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import sovinaAvatar from "@/assets/sovina-avatar.png";
import { Button } from "@/components/ui/button";
import { createServiceClient } from "@/lib/supabase/service";
import { WaitlistForm } from "./WaitlistForm";

const waitlistMode = process.env.LAUNCH_MODE === "waitlist";

// ISR: a página é servida do cache e re-renderiza a cada 5 min — atualiza o
// contador da fila e elimina o cold start a cada visita.
export const revalidate = 300;

// Contador de social proof. Falha em silêncio: a landing nunca quebra por
// causa de um número decorativo.
async function waitlistCount(): Promise<number | null> {
  try {
    const supabase = createServiceClient();
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    return count;
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const count = waitlistMode ? await waitlistCount() : null;
  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <span className="font-display text-2xl tracking-tight">SOVINA</span>
        {!waitlistMode && (
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Entrar</Link>
          </Button>
        )}
      </header>

      <section className="flex-1 grid lg:grid-cols-2 items-center gap-12 px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="order-2 lg:order-1">
          <p className="text-solar text-xs uppercase tracking-[0.3em] mb-6">
            Gestor financeiro autoritário
          </p>
          <h1 className="font-display text-6xl sm:text-8xl leading-[0.9] tracking-tight mb-8 uppercase">
            Você não gere<br />seu dinheiro.
            <br />
            <span className="text-solar">Você presta contas a ele.</span>
          </h1>
          <p className="text-dim text-lg leading-relaxed mb-10 max-w-xl">
            O Sovina é a inteligência que decide o que você pode gastar — e o
            que não pode. Implacável, matemático, sem espaço pra desculpa. O
            aplicativo que dói na sua consciência hoje pra o limite do cartão
            não sangrar amanhã.
          </p>
          {waitlistMode ? (
            <div id="fila">
              <Suspense fallback={null}>
                <WaitlistForm />
              </Suspense>
              {count !== null && count >= 20 && (
                <p className="text-subtle text-sm mt-4">
                  {count} já se submeteram ao julgamento.
                </p>
              )}
              <a
                href="#como-funciona"
                className="inline-block mt-6 text-sm text-dim hover:text-fg transition-colors"
              >
                Ver como funciona ↓
              </a>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-bold tracking-tight">
                <Link href="/login">Submeter-se ao julgamento →</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-bold tracking-tight"
              >
                <a href="#como-funciona">Ver como funciona</a>
              </Button>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <Image
            src={sovinaAvatar}
            alt="O Sovina — leão de terno empunhando um machado, o juiz das suas finanças"
            priority
            placeholder="blur"
            sizes="(max-width: 1024px) 60vw, 40vw"
            className="h-auto w-auto max-h-[78vh] object-contain select-none pointer-events-none"
          />
        </div>
      </section>

      {/* Como funciona — convence quem chegou pelo Threads antes de pedir o e-mail */}
      <section id="como-funciona" className="border-t border-line px-6 py-16">
        <div className="max-w-6xl mx-auto w-full">
          <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
            Como funciona
          </p>
          <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight mb-10">
            Três passos até a sentença
          </h2>

          <div className="grid sm:grid-cols-3 gap-px bg-line border border-line mb-12">
            <Step
              n="01"
              title="O Julgamento"
              text="Você declara o que entra, o que não escapa e quanto quer guardar. Sem arredondar pra cima — eu trabalho com a verdade."
            />
            <Step
              n="02"
              title="A Cota"
              text="Eu decreto dois números por dia: a cota ideal, que protege o seu futuro, e o teto, que é o limite da sobrevivência. Viva entre os dois."
            />
            <Step
              n="03"
              title="O Veredito"
              text="Cada gasto registrado é julgado na hora. Dentro da cota, aprovo com sobriedade. Fora dela, você vai me ouvir."
            />
          </div>

          <blockquote className="border-l-2 border-solar pl-4 max-w-xl mb-12">
            <p className="text-dim text-sm leading-relaxed">
              “R$ 8 no cafezinho. Todo dia útil. São R$ 2.112 por ano que você
              bebeu e esqueceu. Não é sobre o café. É sobre você nunca ter
              feito a conta. Eu fiz.”
            </p>
            <footer className="text-subtle text-xs uppercase tracking-[0.2em] mt-3">
              — O Sovina, julgando um gasto real
            </footer>
          </blockquote>

          <Button asChild size="lg" className="font-bold tracking-tight">
            {waitlistMode ? (
              <a href="#fila">Entrar na fila do julgamento →</a>
            ) : (
              <Link href="/login">Submeter-se ao julgamento →</Link>
            )}
          </Button>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-4 text-xs text-subtle">
        SOVINA · Razão matemática sobre desejo · v0
      </footer>
    </main>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="bg-abismo p-6">
      <p className="font-display text-solar text-3xl mb-3">{n}</p>
      <h3 className="font-display text-xl uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-dim text-sm leading-relaxed">{text}</p>
    </div>
  );
}
