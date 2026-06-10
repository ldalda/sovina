import Link from "next/link";
import Image from "next/image";
import sovinaAvatar from "@/assets/sovina-avatar.png";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "./WaitlistForm";

const waitlistMode = process.env.LAUNCH_MODE === "waitlist";

export default function LandingPage() {
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
            <WaitlistForm />
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

      <footer className="border-t border-line px-6 py-4 text-xs text-subtle">
        SOVINA · Razão matemática sobre desejo · v0
      </footer>
    </main>
  );
}
